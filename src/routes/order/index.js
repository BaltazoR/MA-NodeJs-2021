const { Router } = require('express');
const controllers = require('../../server/controllers');

const router = Router();

router.post('/addorder', (req, res) => {
  controllers.addOrder(req, res);
});

router.get('/getorder', (req, res) => {
  controllers.getOrder(req, res);
});

module.exports = router;
