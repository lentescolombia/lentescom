const Product = require('../models/product.model');
const router = require('express').Router();

//Require paginacion (lista)
router.get('/api/gotashidratantes/:page', (req, res) => {
    let int_perpage = 12;
    let int_page = req.params.page || 1;
    Product.find({type: 'gotashidratantes'})
    .skip(int_page * int_perpage - int_perpage)
    .limit(int_perpage)
    .exec((err, gotashidratantes) => {
        if (err) return res.status(500).json({code: 2, message: err.message})
        Product.count({type: 'gotashidratantes'},(err, count) => {
            if(err) return res.status(500).json({code: 2, message: err.message}); 
            res.status(200).json({code: 1, data: gotashidratantes, pages:Math.ceil(count / int_perpage)});
        })
    })
});

router.get('/api/gotashidratantess/marcas', (req, res) => {
    Product.find({type: 'gotashidratantes'}, {trademark: 1, _id: 0}, (err, marcas) => {
        if(err) return res.status(500).json({code: 2, message: err.message});
        let temp = {};
        marcas = marcas.filter(function(marca){
            let exists = !temp[marca.trademark];
            temp[marca.trademark] = true;
            return exists;
        })
        res.status(200).json({code: 1, data: marcas});
    })
});


//Requiere paginacion (lista)
router.get('/api/gotashidratantes/marcas/:trademark/:page', (req, res) => {
    const trademark = req.params.trademark;
    let int_perpage = 12;
    let int_page = req.params.page;
    Product.find({type: 'gotashidratantes',trademark})
    .skip(int_page * int_perpage - int_perpage)
    .limit(int_perpage)
    .exec((err, gotashidratantes) => {
        if(err) return res.status(500).json({code: 2, message: err.message});
        Product.count({type: 'gotashidratantes', trademark}, (err, count) => {
            if(err) return res.status(500).json({code: 2, message: err.message});
            res.status(200).json({code: 1, data: gotashidratantes, pages: Math.ceil(count / int_perpage)});
        })
    })
})

module.exports = router;