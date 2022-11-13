const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const jwtDecode = require("jwt-decode");
const salidaPlanta = require("../models/salidaPlanta");

// Registro de salida de articulos de planta
router.post("/registro", verifyToken, async (req, res) => {
    const { folio } = req.body;
    //console.log(folio)

    // Inicia validacion para no registrar salida de articulos de planta con el mismo folio
    const busqueda = await salidaPlanta.findOne({ folio });

    if (busqueda && busqueda.folio === folio) {
        return res.status(401).json({mensaje: "Ya existe una salida de planta con este folio"});
    } else {
        const salida = salidaPlanta(req.body);
        await salida
            .save()
            .then((data) =>
                res.status(200).json(
                    { mensaje: "Se ha registrado una salida de planta", datos: data
                    }
                ))
            .catch((error) => res.json({ message: error }));
    }
});

// Obtener todas las salidas de planta registradas
router.get("/listar", verifyToken , async (req, res) => {
    await salidaPlanta
        .find()
        .sort( { _id: -1 } )
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el folio actual
router.get("/obtenerFolioActual", verifyToken , async (req, res) => {
    const registroSalidasPlanta = await salidaPlanta.find().count();
    if(registroSalidasPlanta === 0){
        res.status(200).json({ noSalida: "1"})
    } else {
        const ultimaSalidaPlanta = await salidaPlanta.findOne().sort( { _id: -1 } );
        //console.log(ultimaSalidaPlanta)
        const tempFolio = parseInt(ultimaSalidaPlanta.folio) + 1
        res.status(200).json({ noSalida: tempFolio.toString()})
    }
});

// Listar paginando las salidas de planta registradas
router.get("/listarPaginando" , async (req, res) => {
    const { pagina, limite } = req.query;
    //console.log("Pagina ", pagina , " Limite ", limite)

    const skip = ( pagina - 1) * limite;

    await salidaPlanta
        .find()
        .sort( { _id: -1 } )
        .skip(skip)
        .limit(limite)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener el total de registros de la colección
router.get("/total", verifyToken , async (req, res) => {
    await salidaPlanta
        .find()
        .count()
        .sort( { _id: -1 } )
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Obtener una salida de planta en especifico
router.get("/obtener/:id", verifyToken ,async (req, res) => {
    const { id } = req.params;
    //console.log("buscando")
    await salidaPlanta
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Para obtener una salida de planta segun el folio
router.get("/obtenerDatos/:folio", verifyToken ,async (req, res) => {
    const { folio } = req.params;

    await salidaPlanta
        .findOne({ folio })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Borrar una salida de planta
router.delete("/eliminar/:id", verifyToken ,async (req, res) => {
    const { id } = req.params;
    await salidaPlanta
        .remove({ _id: id })
        .then((data) => res.status(200).json({ mensaje: "Salida de planta eliminada"}))
        .catch((error) => res.json({ message: error }));
});

// Actualizar datos de la salida de planta
router.put("/actualizar/:id", verifyToken ,async (req, res) => {
    const { id } = req.params;
    const { sp, fechaSalida, destino, autoriza, fechaEntrega, articulos } = req.body;
    await salidaPlanta
        .updateOne({ _id: id }, { $set: { sp, fechaSalida, destino, autoriza, fechaEntrega, articulos } })
        .then((data) => res.status(200).json({ mensaje: "Información de la salida de planta actualizada"}))
        .catch((error) => res.json({ message: error }));
});

async function verifyToken(req, res, next) {
    try {
        if (!req.headers.authorization) {
            return res.status(401).send({mensaje: "Petición no Autorizada"});
        }
        let token = req.headers.authorization.split(' ')[1];
        if (token === 'null') {
            return res.status(401).send({mensaje: "Petición no Autorizada"});
        }

        const payload = await jwt.verify(token, 'secretkey');
        if(await isExpired(token)) {
            return res.status(401).send({mensaje: "Token Invalido"});
        }
        if (!payload) {
            return res.status(401).send({mensaje: "Petición no Autorizada"});
        }
        req._id = payload._id;
        next();
    } catch(e) {
        //console.log(e)
        return res.status(401).send({mensaje: "Petición no Autorizada"});
    }
}

async function isExpired(token) {
    const { exp } = jwtDecode(token);
    const expire = exp * 1000;
    const timeout = expire - Date.now()

    if (timeout < 0){
        return true;
    }
    return false;
}

module.exports = router;
