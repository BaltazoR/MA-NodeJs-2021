const services = require('../services');
const { discountPromise } = require('../services/helpers');
const { discountPromisify } = require('../services/helpers');
const { discountAsync } = require('../services/helpers');
const { wrapperRequest } = require('../services');
const { uploadCsv, optimizeJson } = require('../services');
const { csvExpress } = require('../services');

async function handleStreamRoutes(req) {
  try {
    const fileNotOptimise = await uploadCsv(req);
    const filePath = await optimizeJson(fileNotOptimise);
    return filePath;
  } catch (err) {
    console.error('Failed to upload CSV', err);

    return {
      code: 400,
      message: 'the request is empty',
    };
  }
}

function notFound(req, res) {
  const { message, code } = services.notFound();
  res.statusCode = code;
  res.write(message);
  res.end();
}

function filter(req, res) {
  const { message, code } = services.filter(req.query);
  res.code = code;
  res.json(message);
}

function filterPost(req, res) {
  const { message, code } = services.bodyRequestIsEmpty(
    req,
    services.filterPost,
  );
  res.code = code;
  res.json(message);
}

function topPrice(req, res) {
  const { message, code } = services.topPrice(req);
  res.code = code;
  res.json(message);
}

function topPricePost(req, res) {
  const { message, code } = services.bodyRequestIsEmpty(
    req,
    services.topPricePost,
  );
  res.code = code;
  res.json(message);
}

function commonPrice(req, res) {
  const { message, code } = services.commonPrice(req);
  res.code = code;
  res.json(message);
}

function commonPricePost(req, res) {
  const { message, code } = services.bodyRequestIsEmpty(
    req,
    services.commonPricePost,
  );
  res.code = code;
  res.json(message);
}

async function modifyDataJson(req, res) {
  const { message, code } = services.bodyRequestIsEmpty(
    req,
    services.modifyDataJson,
  );

  res.code = code;
  res.json(message);
}

function uploadCsvExpress(req, res) {
  const filePath = csvExpress(req);

  const reqM = { filePath, ...req };

  const { message, code } = services.bodyRequestIsEmpty(
    reqM,
    services.modifyDataJson,
  );

  res.code = code;
  res.json(message);
}

function myPromise(req, res) {
  wrapperRequest(req, res, discountPromise);
}

function myPromisify(req, res) {
  wrapperRequest(req, res, discountPromisify);
}

function myAsync(req, res) {
  wrapperRequest(req, res, discountAsync);
}

module.exports = {
  notFound,
  filter,
  filterPost,
  topPrice,
  topPricePost,
  commonPrice,
  commonPricePost,
  modifyDataJson,
  myPromise,
  myPromisify,
  myAsync,
  handleStreamRoutes,
  uploadCsvExpress,
};
