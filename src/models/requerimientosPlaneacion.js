const mongoose = require("mongoose");
const { Schema } = mongoose;

const RequerimientosPlaneacion = new Schema({
    item: {type: String},
    folio: {type: String},
    sucursal: {type: String},
    requerimiento: {
        semana: {type: String},
        producto: {type: String},
        nombreProducto: {type: String},
        um: {type: String},
        ov: {type: String},
        almacenProductoTerminado: {type: String},
        nombreProveedor: {type: String},
        ordenVenta: { type: Array, default: [] },
        totalProducir: {type: String},
    },
    planeacion: {
        numeroMolde: {type: String},
        numeroCavidades: {type: String},
        opcionesMaquinaria: {type: Array, default: [] }
    },
    bom: {
        material: {type: String},
        idMaterial: {type: String},
        folioMaterial: {type: String},
        precioMaterial: {type: String},
        molido: {type: String},
        pesoPieza: {type: String},
        pesoColada: {type: String},
        kgMaterial: {type: String},
        pigmento: {type: String},
        aplicacion: {type: String},
        pigMb: {type: String},
        materialxTurno: {type: String},
        merma: {type: String},
        empaque: {type: String},
        bolsasCajasUtilizar: {type: String},
    },
    datosRequisicion: {
        kgMaterial: {type: String},
        almacenMP: {type: String},
        cantidadSugerida: {type: String},
        cantidadPedir: {type: String}
    },
    estado: {type: String}
}, {
    timestamps: true
});

module.exports = mongoose.model("RequerimientosPlaneacion", RequerimientosPlaneacion, "RequerimientosPlaneacion");
