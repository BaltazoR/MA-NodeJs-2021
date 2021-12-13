/* eslint-disable global-require */
const path = require('path');
const fs = require('fs');
const { pipeline } = require('stream');
const { promisify } = require('util');
const helpers = require('./helpers');
// const dataJson = require('../data.json');
const { createCsvToJson } = require('./helpers/csv-to-json');
const { optimizeJson: jsonOptimize, calc } = require('./helpers/jsonOptimize');

const promisifiedPipeline = promisify(pipeline);

function latestFile() {
  let latestF = 0;
  const pathFileData = path.resolve('upload');
  // console.log(pathFileData);
  const listFile = fs.readdirSync(pathFileData);
  listFile.forEach((file) => {
    // console.log(file);
    let dateFile = file.replace('.json', '');
    dateFile = Number(dateFile);
    if (typeof dateFile === 'number') {
      if (dateFile > latestF) latestF = dateFile;
      // console.log(latestF);
    }
  });
  let pathLastFile = `${pathFileData}/${latestF}.json`;
  if (!latestF) pathLastFile = path.resolve('data.json');
  return pathLastFile;
}

function notFound() {
  return {
    code: 404,
    message: 'page not found',
  };
}

const rules = {
  item: 'string',
  type: 'string',
  weight: 'number',
  quantity: 'number',
  pricePerKilo: 'string',
  pricePerItem: 'string',
};

function priceNormalization(price) {
  return price.substring(1).replace(/,/, '.');
}

function bodyRequestIsEmpty(req, callback) {
  let output;
  let body = '';

  if (req.method === 'PUT') {
    try {
      const data = fs.readFileSync(req.filePath, 'utf8');
      body = data;
    } catch (err) {
      console.error('ERROR:', err.message);
    }
  } else {
    body = req.body;
  }

  if (body.length === 0) {
    return {
      code: 400,
      message: 'the request is empty',
    };
  }

  try {
    output = JSON.parse(body);
  } catch (err) {
    console.error(err.message);
    return {
      code: 500,
      message: err.message,
    };
  }

  return callback(output);
}

// eslint-disable-next-line consistent-return
function validator(query) {
  if (Object.keys(query).length === 0) {
    return false;
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const qKey in query) {
    if (Object.hasOwnProperty.call(query, qKey)) {
      let result = 0;

      // eslint-disable-next-line no-restricted-syntax
      for (const rKey in rules) {
        if (Object.hasOwnProperty.call(rules, rKey)) {
          if (rKey === qKey) result = 1;
        }
      }
      if (result === 0) return false;
    }
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const key in rules) {
    if (Object.hasOwnProperty.call(rules, key)) {
      if (query[key]) {
        if (
          key === 'item' ||
          key === 'type' ||
          key === 'pricePerKilo' ||
          key === 'pricePerItem'
        ) {
          // eslint-disable-next-line no-param-reassign
          query[key] = String(query[key]);
        }

        if (key === 'weight' || key === 'quantity') {
          // eslint-disable-next-line no-param-reassign
          query[key] = Number(query[key]);
          // eslint-disable-next-line no-restricted-globals
          if (isNaN(query[key])) {
            return false;
          }
        }
        // eslint-disable-next-line valid-typeof
        if (typeof query[key] === rules[key]) {
          if (key === 'pricePerKilo' || key === 'pricePerItem') {
            let price = query[key];
            if (!(price.search(/^\$([0-9]+([,.][0-9]*)?|[0-9]+)/) === -1)) {
              price = priceNormalization(price);
              if (Number(price)) return true;
            }
            return false;
          }
        }
      }
    }
  }
  return true;
}

function filter(params) {
  let message = '';

  const filters = {};

  if (params.toString().length === 0) {
    // eslint-disable-next-line import/no-dynamic-require
    const dataJson = require(`${latestFile()}`);
    message = dataJson;
  } else {
    params.forEach((value, name) => {
      filters[name] = value;
    });

    if (!validator(filters, rules)) {
      return {
        code: 400,
        message: 'Error input data validation',
      };
    }
    const dataJson = require(`${latestFile()}`);
    message = dataJson;

    // eslint-disable-next-line no-restricted-syntax
    for (const element in filters) {
      if (Object.hasOwnProperty.call(filters, element)) {
        message = helpers.helper1.filter(message, element, filters[element]);
      }
    }
  }

  if (message.length === 0) {
    return {
      code: 400,
      message: 'nothing was found for the specified parameters',
    };
  }
  return {
    code: 200,
    message,
  };
}

function filterPost(body) {
  let message = '';

  if (!validator(body, rules)) {
    return {
      code: 400,
      message: 'Error input data validation',
    };
  }

  // eslint-disable-next-line import/no-dynamic-require
  const dataJson = require(`${latestFile()}`);
  message = dataJson;
  // eslint-disable-next-line no-restricted-syntax
  for (const key in body) {
    if (Object.hasOwnProperty.call(body, key)) {
      message = helpers.helper1.filter(message, key, body[key]);
    }
  }

  if (message.length === 0) {
    return {
      code: 400,
      message: 'nothing was found for the specified parameters',
    };
  }
  return {
    code: 200,
    message,
  };
}

function checkValidation(input) {
  let resultOfValidation = false;
  input.forEach((element) => {
    if (!validator(element, rules)) {
      resultOfValidation = true;
    }
  });
  return resultOfValidation;
}

function topPrice() {
  const dataJson = require(`${latestFile()}`);
  if (checkValidation(dataJson)) {
    return {
      code: 400,
      message: 'Error input data validation',
    };
  }

  const message = helpers.helper2.searchHighestCost(dataJson);
  return {
    code: 200,
    message,
  };
}

function topPricePost(body) {
  if (checkValidation(body)) {
    return {
      code: 400,
      message: 'Error input data validation',
    };
  }

  const message = helpers.helper2.searchHighestCost(body);
  return {
    code: 200,
    message,
  };
}

function commonPrice() {
  const dataJson = require(`${latestFile()}`);
  if (checkValidation(dataJson)) {
    return {
      code: 400,
      message: 'Error input data validation',
    };
  }

  const message = helpers.helper3.addCostCalculation(dataJson);
  return {
    code: 200,
    message,
  };
}

function commonPricePost(body) {
  if (checkValidation(body)) {
    return {
      code: 400,
      message: 'Error input data validation',
    };
  }

  const message = helpers.helper3.addCostCalculation(body);
  return {
    code: 200,
    message,
  };
}

function modifyDataJson(body) {
  if (checkValidation(body)) {
    return {
      code: 400,
      message: 'Error input data validation',
    };
  }

  // const pathFileData = path.resolve('./data.json');

  // const data = JSON.stringify(body);
  // fs.writeFileSync(pathFileData, data);

  const message = body;
  return {
    code: 200,
    message,
  };
}

function outResponse(res, data) {
  const { message } = data;
  const { code } = data;

  res.setHeader('Content-Type', 'application/json');
  res.statusCode = code;
  res.write(JSON.stringify({ message }));
  res.end();
}

function wrapperRequest(req, res, method) {
  let input;

  if (req.method === 'POST') {
    const { body } = req;

    if (body.length === 0) {
      // eslint-disable-next-line prefer-promise-reject-errors
      const data = {
        code: 400,
        message: 'the request is empty',
      };
      return outResponse(res, data);
    }
    input = JSON.parse(body);
  }

  if (req.method === 'GET') {
    // eslint-disable-next-line import/no-dynamic-require
    const dataJson = require(`${latestFile()}`);
    input = dataJson;
  }

  if (checkValidation(input)) {
    // eslint-disable-next-line prefer-promise-reject-errors
    const data = {
      code: 400,
      message: 'Error input data validation',
    };
    return outResponse(res, data);
  }

  return method(input).then((message) => {
    const data = {
      message,
      code: 200,
    };
    return outResponse(res, data);
  });
}

// eslint-disable-next-line consistent-return
async function uploadCsv(inputStream) {
  const timestamp = Date.now();

  if (!fs.existsSync('./upload')) {
    fs.mkdirSync('./upload');
  }

  const filePath = `./upload/${timestamp}_not_optimize.json`;
  const outputStream = fs.createWriteStream(filePath);
  const csvToJson = createCsvToJson();
  const optimizeFirst = jsonOptimize();

  try {
    await promisifiedPipeline(
      inputStream,
      csvToJson,
      optimizeFirst,
      outputStream,
    );
    return filePath;
  } catch (err) {
    console.error('CSV pipeline failed', err);
  }
}

// eslint-disable-next-line consistent-return
async function optimizeJson(file) {
  let inputStream = fs.readFileSync(file);
  inputStream = inputStream.toString();
  inputStream = inputStream.replace('[{', '');
  inputStream = inputStream.replace(']', '');
  inputStream = inputStream.split(',{');
  // inputStream = JSON.stringify(inputStream);
  // const timestamp = Date.now();
  const filePath = file.replace('_not_optimize', '');

  let content = calc(inputStream);
  content = content.output;
  content = JSON.stringify(content);

  // const csvToJson = createCsvToJson();

  try {
    fs.writeFileSync(filePath, content);
    fs.unlink(file, (err) => {
      if (err) throw err;
    });
    return filePath;
  } catch (err) {
    console.error('CSV pipeline failed', err);
  }
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
  bodyRequestIsEmpty,
  wrapperRequest,
  uploadCsv,
  optimizeJson,
};
