const express = require('express');
const mongoose = require('mongoose');
const lentesdecontactorouter = require('./routes/lentesdecontacto.route');
const solucionesrouter = require('./routes/soluciones.route')
const productsrouter = require('./routes/products.route');
const gotashidratantesrouter = require('./routes/gotashidratantes.route');
const cuidadoybellezarouter = require('./routes/cuidadoybelleza.route');
const comprarouter = require('./routes/compra.rote');
const assetsrouter = require('./routes/assets.route');
const pedidorouter = require('./routes/pedidos.route');

const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();

mongoose.connect('mongodb://localhost:27017/store',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.once('open', (err) => {
    if(err) return console.log(err.message);
    console.log('Conectado a la base de datos');
})

app.use(express.static(__dirname + '/'))
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());



app.use((function(req, res, next){
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
}))


app.use(lentesdecontactorouter);
app.use(solucionesrouter);
app.use(gotashidratantesrouter);
app.use(cuidadoybellezarouter);
app.use(productsrouter);
app.use(comprarouter);
app.use(assetsrouter);
app.use(pedidorouter);

app.get('/*', (req, res) => {
    res.statusCode = 200;
    res.sendFile(__dirname + '/index.html')
});

app.listen(3001, () => {
    console.log('Server started on port 3001');
})