const { Router } = require('express');
const controllers = require('../../server/controllers');

const router = Router();

router.get('/filter', (req, res) => {
  controllers.filter(req, res);
});

router.post('/filter', (req, res) => {
  controllers.filterPost(req, res);
});

router.get('/topprice', (req, res) => {
  controllers.topPrice(req, res);
});

router.post('/topprice', (req, res) => {
  controllers.topPricePost(req, res);
});

router.get('/commonprice', (req, res) => {
  controllers.commonPrice(req, res);
});

router.post('/commonprice', (req, res) => {
  controllers.commonPricePost(req, res);
});

module.exports = router;
