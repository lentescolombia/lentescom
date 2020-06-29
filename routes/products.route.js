const router = require('express').Router();
const ProductsController = require('../controllers/ProductsController');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './images');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
})

const upload = multer({storage});

let mid = upload.fields([
    {name: 'image'},
    {name: 'name'}, 
    {name: 'trademark'}, 
    {name: 'type'}, 
    {name: 'initialprice'}, 
    {name: 'discount'},
    {name: 'laboratory'},
    {name: 'visualcondition'}
])

router.post('/api/addproduct', mid, ProductsController.addProduct);
router.get('/api/products/delete/:id', ProductsController.deleteProduct);
router.post('/api/products/update/:id', mid,ProductsController.updateProduct);
router.get('/api/products/:page', ProductsController.getAllProducts);

module.exports = router;