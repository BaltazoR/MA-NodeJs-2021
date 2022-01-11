const { Router } = require('express');
const controllers = require('../../server/controllers');

const router = Router();

router.put('/', (req, res) => {
  // controllers.uploadCsvExpress(req, res);
  controllers.uploadCsvToDb(req, res);
});

router.post('/', (req, res) => {
  controllers.modifyDataJson(req, res);
});

module.exports = router;
