const mongoose = require("mongoose");
const { Schema } = mongoose;

const mes = new Schema({
    folio: { type: String },
    mes: { type: String },
    dias: { type: String },
    noMaquinas: { type: String },
    sucursal: { type: String },
    estado: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model("Mes", mes, "Mes");
