const { Router } = require('express');
const controllers = require('../../server/controllers');

const router = Router();

router.post('/createproduct', (req, res) => {
  controllers.createProduct(req, res);
});

router.put('/updateproduct/:id', (req, res) => {
  controllers.updateProduct(req, res);
});

router.get('/getproduct/:id', (req, res) => {
  controllers.getProductId(req, res);
});

router.get('/getproduct/', (req, res) => {
  controllers.getProduct(req, res);
});

router.delete('/deleteproduct/:id', (req, res) => {
  controllers.deleteProduct(req, res);
});

module.exports = router;
