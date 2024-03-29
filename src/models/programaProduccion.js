const mongoose = require("mongoose");
const { Schema } = mongoose;

const programaProduccion = new Schema({
    folio: { type: String },
    folioOP: { type: String },
    folioPlaneacion: { type: String },
    sucursal: { type: String },
    semana: { type: String },
    ordenProduccion: {
        noMaquina: { type: String },
        maquina: { type: String },
        semana: { type: String },
        fechaInicio: { type: String },
        cliente: { type: String },
        nombreCliente: { type: String },
        producto: { type: String },
        nombreProducto: { type: String },
        cantidadFabricar: { type: String },
        acumulado: { type: String },
        ciclo: { type: String },
        cavidades: { type: String },
        stdTurno: { type: String },
        pendienteFabricar: { type: String },
        operadores: { type: String },
        noInterno: { type: String },
        turnosRequeridos: { type: String },
    },
    programa: {
        fechaInicio: { type: String },
        lunesT1: { type: String },
        estadoLT1: { type: String },
        lunesT2: { type: String },
        estadoLT2: { type: String },
        martesT1: { type: String },
        estadoMT1: { type: String },
        martesT2: { type: String },
        estadoMT2: { type: String },
        miercolesT1: { type: String },
        estadoMIT1: { type: String },
        miercolesT2: { type: String },
        estadoMIT2: { type: String },
        juevesT1: { type: String },
        estadoJT1: { type: String },
        juevesT2: { type: String },
        estadoJT2: { type: String },
        viernesT1: { type: String },
        estadoVT1: { type: String },
        viernesT2: { type: String },
        estadoVT2: { type: String },
        sabadoT1: { type: String },
        estadoST1: { type: String },
    },
    estado: { type: String },
}, {
    timestamps: true
});

module.exports = mongoose.model("ProgramaProduccion", programaProduccion, "ProgramaProduccion");
