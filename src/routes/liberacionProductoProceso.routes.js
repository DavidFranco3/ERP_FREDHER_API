const express = require("express");
const router = express.Router();
const liberacionProductoProceso = require("../models/liberacionProductoProceso");

// Registro de pedidos
router.post("/registro", async (req, res) => {
    const { folio } = req.body;
    //console.log(folio)

    // Inicia validacion para no registrar una liberacion con el mismo folio
    const busqueda = await liberacionProductoProceso.findOne({ folio });

    if (busqueda && busqueda.folio === folio) {
        return res.status(401).json({ mensaje: "Ya existe una liberacion con este folio" });
    } else {
        const liberacion = liberacionProductoProceso(req.body);
        await liberacion
            .save()
            .then((data) =>
                res.status(200).json(
                    {
                        mensaje: "Se ha registrado la liberacion", datos: data
                    }
                ))
            .catch((error) => res.json({ message: error }));
    }
});

// Obtener todos los pedidos
router.get("/listar", async (req, res) => {
    const { sucursal } = req.query;

    await liberacionProductoProceso
        .find({ sucursal })
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el numero de liberacion
router.get("/obtenerNoLiberacion", async (req, res) => {
    const RegistroStatus = await liberacionProductoProceso.find().count();
    if (RegistroStatus === 0) {
        res.status(200).json({ noLiberacion: "HLP-1" })
    } else {
        const ultimaLiberacion = await liberacionProductoProceso.findOne().sort({ _id: -1 });
        const tempFolio1 = ultimaLiberacion.folio.split("-")
        const tempFolio = parseInt(tempFolio1[1]) + 1;
        res.status(200).json({ noLiberacion: "HLP-" + tempFolio.toString().padStart(1, 0) })
    }
});

// Obtener el numero de folio de la compra actual
router.get("/obtenerItem", async (req, res) => {
    const registroStatus = await liberacionProductoProceso.find().count();
    if (registroStatus === 0) {
        res.status(200).json({ item: 1 });
    } else {
        const [ultimoItem] = await liberacionProductoProceso
            .find({})
            .sort({ item: -1 })
            .limit(1);
        const tempItem = parseInt(ultimoItem.item) + 1;
        res.status(200).json({ item: tempItem });
    }
});
// Listar las liberaciones registradas
router.get("/listarPaginando", async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = (pagina - 1) * limite;

    await liberacionProductoProceso
        .find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener un pedido en especifico
router.get("/obtener/:id", async (req, res) => {
    const { id } = req.params;
    //console.log("buscando")
    await liberacionProductoProceso
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/total", async (req, res) => {
    await liberacionProductoProceso
        .find()
        .count()
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Para obtener una liberacion segun el folio
router.get("/obtenerDatosLiberacion/:folio", async (req, res) => {
    const { folio } = req.params;

    await liberacionProductoProceso
        .findOne({ folio })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Borrar un pedido
router.delete("/eliminar/:id", async (req, res) => {
    const { id } = req.params;
    await liberacionProductoProceso
        .deleteOne({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Hoja de liberación de producto y proceso eliminada" }))
        .catch((error) => res.json({ message: error }));
});

// Para actualizar el estado de la liberacion
router.put("/actualizarEstado/:id", async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    await liberacionProductoProceso
        .updateOne({ _id: id }, { $set: { estado } })
        .then((data) => res.status(200).json({ mensaje: "Hoja de liberación de producto y proceso cancelada" }))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos del pedido
router.put("/actualizar/:id", async (req, res) => {
    const { id } = req.params;
    const { cliente, descripcionPieza, noParteMolde, procesoRealizado, fechaElaboracion, fechaArranqueMolde, noMaquina, hojaLiberacion, elaboro, turno, proceso, producto, observaciones } = req.body;
    await liberacionProductoProceso
        .updateOne({ _id: id }, { $set: { cliente, descripcionPieza, noParteMolde, procesoRealizado, fechaElaboracion, fechaArranqueMolde, noMaquina, hojaLiberacion, elaboro, turno, proceso, producto, observaciones } })
        .then((data) => res.status(200).json({ mensaje: "Información de la hoja de liberacion de producto y proceso actualizada" }))
        .catch((error) => res.json({ message: error }));
});

module.exports = router;
