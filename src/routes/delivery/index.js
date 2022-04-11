const { Router } = require('express');
const controllers = require('../../server/controllers');

const router = Router();

router.post('/getcities', (req, res) => {
  controllers.getCities(req, res);
});

router.post('/getdocumentprice', (req, res) => {
  controllers.getDocumentPrice(req, res);
});

module.exports = router;
