const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SolucionesSchema = new Schema({
    name: {type: String, required: true, indexes:[{unique: true}]},
    initialprice: {
        type: Number,
        required: true,
    },
    dicount: {
        type: Number,
        default: 0
    },
    price:{
        type: Number,
    },
    image: {
        type: String,
        required: true
    },
    trademark: {
        type: String,
    }
})

SolucionesSchema.pre('save', (next) => {
    let product = this
    if(product.isModified('initialprice') || product.isModified('discount')){
        product.price = product.initialprice - product.initialprice * product.discount / 100;
        return next()
    }
    return next()
})

module.exports = mongoose.model('Soluciones', SolucionesSchema);