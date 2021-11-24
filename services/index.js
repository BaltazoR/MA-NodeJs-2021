const util = require('util');
const path = require('path');
const fs = require('fs');
const helpers = require('./helpers');
const dataJson = require('../data.json');

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

function bodyRequestIsEmpty(reqBody, callback) {
  const body = reqBody;

  if (body.length === 0) {
    return {
      code: 400,
      message: 'the request is empty',
    };
  }
  return callback(JSON.parse(body));
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

  const pathFileData = path.resolve('./data.json');

  const data = JSON.stringify(body);
  fs.writeFileSync(pathFileData, data);

  const message = body;
  return {
    code: 200,
    message,
  };
}

function myPromise(req) {
  // eslint-disable-next-line consistent-return
  return new Promise((resolve, reject) => {
    let input;

    if (req.method === 'POST') {
      const { body } = req;

      if (body.length === 0) {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject({
          code: 400,
          message: 'the request is empty',
        });
      }
      input = JSON.parse(body);
    }

    if (req.method === 'GET') {
      input = dataJson;
    }

    if (checkValidation(input)) {
      // eslint-disable-next-line prefer-promise-reject-errors
      reject({
        code: 400,
        message: 'Error input data validation',
      });
    }

    const output = [];

    const allPromise = input.map(
      (element) =>
        new Promise((resolveAll) => {
          helpers.helper2
            .discountPromise()
            .then((result) => {
              // console.log(element, 'then', result);
              const priceWithDiscount = `$${helpers.helper2.discountCalculation(
                element,
                result,
              )}`;
              output.push({ ...element, priceWithDiscount });
              resolveAll();
            })
            .catch(() => {
              helpers.helper2
                .discountPromise()
                .then((result) => {
                  // eslint-disable-next-line max-len
                  const priceWithDiscount = `$${helpers.helper2.discountCalculation(
                    element,
                    result,
                  )}`;
                  output.push({ ...element, priceWithDiscount });
                  resolveAll();
                })
                .catch((err) => {
                  // eslint-disable-next-line prefer-promise-reject-errors
                  reject({
                    code: 500,
                    message: err.message,
                  });
                });
            });
        }),
    );

    Promise.all(allPromise).then(() => resolve(output));
  });
}

function myPromisify(req, callback) {
  let input;

  if (req.method === 'POST') {
    const { body } = req;

    if (body.length === 0) {
      const err = {
        code: 400,
        message: 'the request is empty',
      };
      callback(err);
    }
    input = JSON.parse(body);
  }

  if (req.method === 'GET') {
    input = dataJson;
  }

  if (checkValidation(input)) {
    // eslint-disable-next-line prefer-promise-reject-errors
    const err = {
      code: 400,
      message: 'Error input data validation',
    };
    callback(err);
  }

  const output = [];

  const promisifyElement = util.promisify(helpers.helper2.discountPromisify);

  const allPromise = input.map((element) =>
    promisifyElement()
      .then((result) => {
        // eslint-disable-next-line max-len
        const priceWithDiscount = `$${helpers.helper2.discountCalculation(
          element,
          result,
        )}`;
        output.push({ ...element, priceWithDiscount });
      })
      .catch(() => {
        promisifyElement()
          .then((result) => {
            const priceWithDiscount = `$${helpers.helper2.discountCalculation(
              element,
              result,
            )}`;
            output.push({ ...element, priceWithDiscount });
          })
          .catch((err) => {
            const error = {
              code: 500,
              message: err.message,
            };
            callback(error);
          });
      }),
  );

  Promise.all(allPromise)
    .then(() => callback(null, output))
    .catch((err) => {
      const error = {
        code: 500,
        message: err.message,
      };
      callback(error);
    });
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
  myPromise,
  myPromisify,
};
