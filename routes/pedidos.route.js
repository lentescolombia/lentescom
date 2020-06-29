const Pedido = require('../models/Pedido.model');
const router = require('express').Router();

router.get('/api/pedidos/pendientes', (req, res) => {
    Pedido.find({estado: 1}, (err, pedidos) => {
        if(err) return res.status(500).json({code: 2, message: err.message});
        res.status(200).json({code: 1, data: pedidos})
    });
});

router.get('/api/pedidos/despachados', (req, res) => {
    Pedido.find({estado: 2}, (err, pedidos) => {
        if(err) return res.status(500).json({code: 2, message: err.message});
        res.status(200).json({code: 1, data: pedidos})
    })
});

router.get('/api/pedidos/despachar/:referenciapedido', (req, res) => {
    let referencia_pedido = req.params.referenciapedido;
    Pedido.updateOne({referencia: referencia_pedido}, {estado: 2}, (err, pedido) => {
        if(err) return res.status(500).json({code: 2, message: err.message});
        res.status(200).json({code: 1, message: 'El pedido ha sido despachado', data: pedido});
    })
})

router.get('/api/pedidos/eliminar/:referenciapedido', (req, res) => {
    let referencia_pedido = req.params.referenciapedido;
    Pedido.deleteOne({referencia: referencia_pedido}, (err) => {
        if(err) return res.status(500).json({code: 2, message: err.message});
        res.status(200).json({code: 1, message: 'El pedido ha sido eliminado'});
    })
});

router.get('/api/pedidos/:referencia/productos', (req, res) => {
    let referencia = req.params.referencia;
    Pedido.findOne({referencia})
    .populate('productos')
    .exec((err, pedido) => {
        if(err) return res.status(500).json({code: 2, message: err.message});
        res.status(200).json({code: 1, data: pedido});
    })
})


module.exports = router;