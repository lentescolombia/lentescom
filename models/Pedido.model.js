const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let PedidoSchema = new Schema({
    referencia: {
        type: String,
        required: true,
        index:{unique: true}
    },
    ref_payco: {
        type: Number,
        default: 0
    },
    description:{
        type: String
    },
    amount: {
        type: Number
    },
    estado: {
        type: Number,
        default: 0
    },
    date:{
        type: String,
        default: Date.now()
    },
    nombre_comprador: {
        type: String,
        required: true
    },
    direccion_comprador: {
        type: String,
        required: true
    },
    documento_comprador: {
        type: String,
        required: true
    },
    tipo_documento: {
        type: String,
        required: true
    },
    productos:[{type: Schema.Types.ObjectId, ref: 'Product'}]
})

module.exports = mongoose.model('Pedido', PedidoSchema);