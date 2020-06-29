const Product = require('../models/product.model');
const fs = require('fs');
const path = require('path');

const addProduct = (req, res) => {
    /*let product = new Product(req.body);
    product.save((err, product) => {
        if(err) return res.status(500).json({code: 2, message: err.message});
        res.status(200).json({code: 1, message: 'Producto agregado correctamente', product});
    })*/
    const body = req.body;
    let new_product = {
        ...body,
        initialprice: parseInt(body.initialprice),
        discount: parseInt(body.discount),
        image: '/images/' + req.files.image[0].filename
    }
    let product = new Product(new_product);
    product.save((err, product) => {
        if(err) return res.status(500).json({code: 2, message: err.message});
        res.status(200).json({code: 1, message: 'Producto agregado correctamente', product});
    });
}

//Requiere paginacion (lista)
const getAllProducts = (req, res) => {
    let int_perpage = 12;
    let int_page = req.params.page || 1;
    Product.find()
    .skip(int_page * int_perpage - int_perpage)
    .limit(int_perpage)
    .exec((err, products) => {
        if (err) return res.status(500).json({code: 2, message: err.message});
        Product.count((err, count) => {
            if(err) return res.status(500).json({code: 2, message: err.message});
            res.status(200).json({code: 1, data: products, pages: Math.ceil(count / int_perpage)});
        })
    })
}


const deleteProduct = (req, res) => {
    let product_id = req.params.id;
    Product.findOne({_id: product_id},(err, product) => {
        let image_path = path.join(__dirname, '..', product.image);
        fs.unlink(image_path, (err) => {
            Product.deleteOne({_id: product_id}, (err) => {
                if(err) return res.status(500).json({code: 2, message: err.message});
                res.status(200).json({code: 1, message: 'El producto ha sido eliminado'});
            })
        })
    })
}

const updateProduct = (req, res) => {
    const body = req.body;
    const product_id = req.params.id;
    let updated_product = {
        ...body,
        initialprice: parseInt(body.initialprice),
        discount: parseInt(body.discount),
        price: parseInt(body.initialprice) - parseInt(body.initialprice) * parseInt(body.discount) / 100,
        image: '/images/' + req.files.image[0].filename
    }
    Product.findOne({_id: product_id}, (err, product) => {
        if (err) return res.status(500).json({code:2, message: err.message});
        let beforepath = path.join(__dirname, '..', product.image);
        fs.unlink(beforepath, (err) => { //eliminando la imagen actual del producto
            Product.updateOne({_id: product_id}, updated_product, (err, product) => {
                if(err) return res.status(500).json({code: 2, message: err.message});
                res.status(200).json({code: 1, data: product});
            })
        })
    })
}

module.exports = {
    addProduct,
    getAllProducts,
    deleteProduct,
    updateProduct
}