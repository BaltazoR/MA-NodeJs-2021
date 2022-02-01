const { Router } = require('express');
const controllers = require('../../server/controllers');

const router = Router();

router.post('/registration', (req, res) => {
  controllers.registration(req, res);
});

router.post('/login', (req, res) => {
  controllers.login(req, res);
});

router.get('/refresh', (req, res) => {
  controllers.updRefreshToken(req, res);
});

module.exports = router;
