const express = require('express');
const router = express.Router();
const Product = require('../models/product.model');
const Pedido = require('../models/Pedido.model');
const path = require('path');
const axios = require('axios');

function getData(cart){
    return new Promise(async (resolve, reject) => {
        let price = 0;
        let products = [];
        for(let i = 0;i < cart.length;i++){
            products.push(cart[i]._id);
            let match = await Product.find({_id: cart[i]._id});
            price += match[0].price;
            if(i == cart.length - 1){
                resolve({
                    products,
                    price
                })
            }
        }
    })
}

router.post('/api/comprar',(req, res, next) => {
    let body = "";
    req.on('data', chunk => {
        body += chunk;
    })
    req.on('end', ()=>{
        req.body = JSON.parse(body);
        
        next()
    })
}, (req, res) => {
    let cart = req.body.cart;
    let userInfo = req.body.userInfo;
    getData(cart)
    .then(data => {
        let json = {
            name: 'Productos de lentes.com',
            description: `Compra de ${data.products.length} productos de lentes.com`,
            invoice: Date.now(),
            currency: 'cop',
            amount: `${data.price}`,
            tax_base: '0',
            tax: '0',
            country: 'co',
            lang: 'es',
            external: 'false',
            extra1: data.products.join(','),
            response: 'https://www.lentes-colombia.com/api/response',
            methodsDisable: ["CASH", 'PSE', 'SP', 'DP'],
            address_billing: userInfo.address_billing,
            type_doc_billing: userInfo.type_doc_billing,
            number_doc_billing: userInfo.number_doc_billing
        }
        let pedido = new Pedido({
            nombre_comprador: userInfo.name_billing,
            direccion_comprador: userInfo.address_billing,
            tipo_documento: userInfo.type_doc_billing,
            documento_comprador: userInfo.number_doc_billing,
            productos: data.products,
            amount: json.amount,
            description: json.description,
            referencia: json.invoice
        });
        pedido.save((err, pedido) => {
            if(err) return res.status(500).json({code: 2, message: err.message});
            res.status(200).json({code: 1, data: json});
        })
    })
})

router.get('/api/response', (req, res) => {
    res.status(200);
    res.sendFile(path.join(__dirname, '../response.html'));
})

router.post('/api/response', (req, res) => {
    res.status(200);
    res.sendFile(path.join(__dirname, '../response.html'));
})

router.post('/api/confirmation', (req, res, next) => {
    let body = "";
    req.on('data', (chunk) => {
        body += chunk;
    })
    req.on('end', () => {
        req.body = JSON.parse(body);
        next();
    })
}, (req, res) => {
    axios.get(`https://secure.epayco.co/validation/v1/reference/${req.body.ref_payco}`)
    .then(response => {
        if(response.data.data.x_cod_response == 1){
            Pedido.updateOne({referencia: response.data.data.x_id_invoice}, {
                ref_payco: response.data.data.x_ref_payco,
                estado: 1,
                date: response.data.data.x_transaction_date
            }, (err, pedido) => {
                if(err) console.log('Error al actualizar el pedido', err.message);
                else console.log('Pedido actualizado ', response.data.data.x_id_invoice);
            })
        } else if (response.data.data.x_cod_response == 2 || response.data.data.x_cod_response == 4){
            Pedido.deleteOne({referencia: response.data.data.x_id_invoice}, (err) => {
                if(err) console.log('Error al borrar el pedido ', err.message);
                else console.log('Pedido borrado ', response.data.data.x_id_invoice)
            });
        }
        Pedido.findOne({referencia: response.data.data.x_id_invoice}, (err, pedido) => {
            if (err) console.log('Error al obtener datos del pedido');
            else {
                let data = {
                    pedido,
                    data: response.data.data
                }
                res.status(200).json(data)
            }
        })
    })
})

module.exports = router;