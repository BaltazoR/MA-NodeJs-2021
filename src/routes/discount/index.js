const { Router } = require('express');
const controllers = require('../../server/controllers');

const router = Router();

router.get('/promise', (req, res) => {
  controllers.myPromise(req, res);
});

router.post('/promise', (req, res) => {
  controllers.myPromise(req, res);
});

router.get('/promisify', (req, res) => {
  controllers.myPromisify(req, res);
});

router.post('/promisify', (req, res) => {
  controllers.myPromisify(req, res);
});

router.get('/async', (req, res) => {
  controllers.myAsync(req, res);
});

router.post('/async', (req, res) => {
  controllers.myAsync(req, res);
});

module.exports = router;
