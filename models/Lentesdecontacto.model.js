const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LentesDeContactoSchema = new Schema({
    name: {type: String, required: true, indexes: [{unique: true}]},
    initialprice: {
        type: Number,
        required: true,
    },
    discount: {
        type: Number,
        default: 0
    },
    price:{
        type: Number,
    },
    image: {
        type: String,
        required: true,
    },
    trademark: {
        type: String,
    },
    visualcondition: {
        type: String,
    },
    laboratory:{
        type: String
    }
})

LentesDeContactoSchema.pre('save', function (next){
    let product = this
    if(product.isModified('initialprice') || product.isModified('discount')){
        if(product.dicount > 0){
            product.price = product.initialprice - product.initialprice * product.discount / 100;
        } else {
            product.price = product.initialprice;
        }
        return next()
    }
    return next()
})

module.exports = mongoose.model('LentesDeContacto', LentesDeContactoSchema);