const Product = require('../models/product.model')
const router = require('express').Router();


//Require paginacion (lista)
router.get('/api/lentesdecontacto/:page', (req, res) => {
    let int_perpage = 12;
    let int_page = req.params.page || 1;
    Product.find({type: 'lentecontacto'})
    .skip(int_page * int_perpage - int_perpage)
    .limit(int_perpage)
    .exec((err, lentesdecontacto) => {
        if (err) return res.status(500).json({code: 2, message: err.message})
        Product.count({type: 'lentecontacto'},(err, count) => {
            if(err) return res.status(500).json({code: 2, message: err.message}); 
            res.status(200).json({code: 1, data: lentesdecontacto, pages: Math.ceil(count / int_perpage)});
        })
    })
});

router.get('/api/lentesdecontactos/marcas', (req, res) => {
    Product.find({type: 'lentecontacto'}, {trademark: 1, _id: 0}, (err, marcas) => {
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


//Require paginacion (lista)
router.get('/api/lentesdecontacto/marcas/:trademark/:page', (req, res) => {
    let int_perpage = 12;
    let int_page = req.params.page;
    const trademark = req.params.trademark;
    Product.find({type: 'lentecontacto',trademark})
    .skip(int_page * int_perpage - int_perpage)
    .limit(int_perpage)
    .exec((err, lentesdecontacto) => {
        if(err) return res.status(500).json({code: 2, message: err.message});
        Product.count({type: 'lentecontacto', trademark}, (err, count) => {
            if(err) return res.status(500).json({code: 2, message: err.message});
            res.status(200).json({code: 1, data: lentesdecontacto, pages: Math.ceil(count / int_perpage)});
        })
    })
})

router.get('/api/lentesdecontactos/laboratorios', (req, res) => {
    Product.find({type: 'lentecontacto'}, {laboratory: 1, _id: 0}, (err, laboratorios) => {
        if(err) return res.status(500).json({code: 2, message: err.message});
        let temp = {};
        laboratorios = laboratorios.filter(function(laboratorio){
            let exists = !temp[laboratorio.laboratory];
            temp[laboratorio.laboratory] = true;
            return exists;
        })
        res.status(200).json({code: 1, data: laboratorios});
    })
})

//Require paginacion (lista)
router.get('/api/lentesdecontacto/laboratorios/:laboratorio/:page', (req, res) => {
    let int_perpage = 12;
    let int_page = req.params.page;
    let laboratorio = req.params.laboratorio;
    Product.find({type: 'lentecontacto', laboratory: laboratorio})
    .skip(int_perpage * int_page - int_perpage)
    .limit(int_perpage)
    .exec((err, lentesdecontacto) => {
        if(err) return res.status(500).json({code: 2, message: err.message});
        Product.count({type: 'lentecontacto', laboratory: laboratorio}, (err, count) => {
            if(err) return res.status(500).json({code: 2, message: err.message});
            res.status(200).json({code: 1, data: lentesdecontacto, pages: Math.ceil(count / int_perpage)});
        })
    })
})

router.get('/api/lentesdecontactos/vconditions', (req, res) => {
    Product.find({type: 'lentecontacto'}, {visualcondition: 1, _id: 0}, (err, vconds) => {
        if(err) return res.status(500).json({code: 2, message: err.message});
        let temp = {};
        vconds = vconds.filter(function(vcond){
            let exists = !temp[vcond.visualcondition];
            temp[vcond.visualcondition] = true;
            return exists;
        })
        res.status(200).json({code: 1, data: vconds});
    })
})


//Requiere paginacion (lista)
router.get('/api/lentesdecontacto/vconds/:vcond/:page', (req, res) => {
    let int_perpage = 12;
    let int_page = req.params.page;
    let vcond = req.params.vcond;
    Product.find({type: 'lentecontacto', visualcondition: vcond})
    .skip(int_page * int_perpage - int_perpage)
    .limit(int_perpage)
    .exec((err, lentesdecontacto) => {
        if (err) return res.status(500).json({code: 2, message: err.message});
        Product.count({type: 'lentecontacto', visualcondition: vcond}, (err, count) => {
            if(err) return res.status(500).json({code: 2, message: err.message});
            res.status(200).json({code: 1, data: lentesdecontacto, pages: Math.ceil(count / int_perpage)});
        })
    })
})

module.exports = router;