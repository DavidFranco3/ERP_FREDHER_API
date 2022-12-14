const mongoose = require("mongoose");
const { Schema } = mongoose;

const insumos = new Schema({
    item: {type: String},
    folio: { type: String },
    descripcion: {type: String},
    um: {type: String},
    precio: {type: String},
    sucursal: {type: String},
    proveedor: {type: String}
}, {
    timestamps: true
});

module.exports = mongoose.model("Insumos", insumos, "Insumos");
