const router = require('express').Router();
const path = require('path');
const fs = require('fs');

router.get('/logo', (req, res) => {
    let logo_path = path.join(__dirname, '..', 'assets', 'logo', 'logo-lentes.png');
    fs.stat(logo_path, (err, stat) => {
        if(err) return res.status(404).json({code: 2, message: err.message});
        res.header({
            'Content-Type':'image/png'
        })
        fs.createReadStream(logo_path).pipe(res);
    })
})

router.get('/images/:imagename', (req, res) => {
    console.log('solicitud imagen');
    const imagename = req.params.imagename;
    let extension = imagename.split('.');
    extension = extension[extension.length - 1];
    const image_path = path.join(__dirname, '..', 'images', imagename);
    fs.stat(image_path, (err, stat) => {
        if(err) return res.status(404).json({code: 2, message: err.message});
        res.header({
            'Content-Type':`image/${extension}`
        })
        fs.createReadStream(image_path).pipe(res);
    })
})


module.exports = router;