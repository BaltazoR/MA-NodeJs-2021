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

async function uploadCsvToDb(req, res) {
  const { message, code } = await services.bodyIsEmpty(
    req,
    services.uploadCsvToDb,
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

async function createProduct(req, res) {
  const { message, code } = await services.createProduct(req);
  res.statusCode = code;
  res.json(message);
}

async function updateProduct(req, res) {
  const { message, code } = await services.updateProduct(req);
  res.statusCode = code;
  res.json(message);
}

async function getProductId(req, res) {
  const { message, code } = await services.getProductId(req);
  res.statusCode = code;
  res.json(message);
}

async function getProduct(req, res) {
  const { message, code } = await services.getProduct(req);
  res.statusCode = code;
  res.json(message);
}

async function deleteProduct(req, res) {
  const { message, code } = await services.deleteProduct(req);
  res.statusCode = code;
  res.json(message);
}

async function registration(req, res) {
  const { message, code } = await services.registration(req);
  res.statusCode = code;
  res.json(message);
}

async function login(req, res) {
  const { message, code } = await services.login(req);
  res.statusCode = code;
  res.json(message);
}

async function addOrder(req, res) {
  const { message, code } = await services.addOrder(req);
  res.statusCode = code;
  res.json(message);
}

async function getOrder(req, res) {
  const { message, code } = await services.getOrder(req);
  res.statusCode = code;
  res.json(message);
}

async function updRefreshToken(req, res) {
  const { message, code } = await services.updRefreshToken(req);
  res.statusCode = code;
  res.json(message);
}

async function getCities(req, res) {
  const { message, code } = await services.getCities(req);
  res.statusCode = code;
  res.json(message);
}

async function getDocumentPrice(req, res) {
  const { message, code } = await services.getDocumentPrice(req);
  res.statusCode = code;
  res.json(message);
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
  createProduct,
  updateProduct,
  getProductId,
  getProduct,
  deleteProduct,
  uploadCsvToDb,
  registration,
  login,
  addOrder,
  getOrder,
  updRefreshToken,
  getCities,
  getDocumentPrice,
};
