const { Router } = require('express');
const controllers = require('../../server/controllers');

const router = Router();

router.post('/registration', (req, res) => {
  controllers.registration(req, res);
});

router.post('/login', (req, res) => {
  controllers.login(req, res);
});

module.exports = router;
