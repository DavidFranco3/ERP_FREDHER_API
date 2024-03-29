const express = require("express");
const router = express.Router();
const produccion = require("../models/produccion");

// Registro de pedidos
router.post("/registro", async (req, res) => {
    const { folio } = req.body;
    //console.log(folio)

    // Inicia validacion para no registrar produccion con el mismo folio
    const busqueda = await produccion.findOne({ folio });

    if (busqueda && busqueda.folio === folio) {
        return res.status(401).json({ mensaje: "Ya existe un produccion con este folio" });
    } else {
        const producciones = produccion(req.body);
        await producciones
            .save()
            .then((data) =>
                res.status(200).json(
                    {
                        mensaje: "Se ha registrado el produccion", datos: data
                    }
                ))
            .catch((error) => res.json({ message: error }));
    }
});

// Obtener todos los pedidos
router.get("/listar", async (req, res) => {
    const { sucursal } = req.query;

    await produccion
        .find({ sucursal })
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener todos los pedidos
router.get("/listarActivas", async (req, res) => {
    const { sucursal } = req.query;

    await produccion
        .find({ sucursal, estado: "true" })
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el numero de produccion
router.get("/obtenerNoProduccion", async (req, res) => {
    const RegistroProduccion = await produccion.find().count();
    if (RegistroProduccion === 0) {
        res.status(200).json({ noProduccion: "OP-1" })
    } else {
        const ultimaProduccion = await produccion.findOne().sort({ _id: -1 });
        const tempFolio1 = ultimaProduccion.folio.split("-")
        const tempFolio = parseInt(tempFolio1[1]) + 1;
        res.status(200).json({ noProduccion: "OP-" + tempFolio.toString().padStart(1, 0) })
    }
});

// Obtener el numero de folio de la compra actual
router.get("/obtenerItem", async (req, res) => {
    const registroProduccion = await produccion.find().count();
    if (registroProduccion === 0) {
        res.status(200).json({ item: 1 });
    } else {
        const [ultimoItem] = await produccion
            .find({})
            .sort({ item: -1 })
            .limit(1);
        const tempItem = parseInt(ultimoItem.item) + 1;
        res.status(200).json({ item: tempItem });
    }
});
// Listar las producciones registrados
router.get("/listarPaginando", async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = (pagina - 1) * limite;

    await produccion
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
    await produccion
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/total", async (req, res) => {
    await produccion
        .find()
        .count()
        .sort({ _id: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Para obtener una produccion segun el folio
router.get("/obtenerDatosProduccion/:folio", async (req, res) => {
    const { folio } = req.params;

    await produccion
        .findOne({ folio })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Borrar un pedido
router.delete("/eliminar/:id", async (req, res) => {
    const { id } = req.params;
    await produccion
        .deleteOne({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Orden de producción eliminada" }))
        .catch((error) => res.json({ message: error }));
});

// Para actualizar el estado del produccion
router.put("/actualizarEstado/:id", async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    await produccion
        .updateOne({ _id: id }, { $set: { estado } })
        .then((data) => res.status(200).json({ mensaje: "Orden de producción cancelada correctamente" }))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos del pedido
router.put("/actualizar/:id", async (req, res) => {
    const { id } = req.params;
    const { acumulado, acumuladoMaterial, generalidades, planeacion, bom, resultados, materiaPrima, observaciones } = req.body;
    await produccion
        .updateOne({ _id: id }, { $set: { acumulado, acumuladoMaterial, generalidades, planeacion, bom, resultados, materiaPrima, observaciones } })
        .then((data) => res.status(200).json({ mensaje: "Información de la orden de produccion actualizada" }))
        .catch((error) => res.json({ message: error }));
});

module.exports = router;
