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
// eslint-disable-next-line consistent-return
function validator(query) {
  if (Object.keys(query).length === 0) {
    return false;
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const key in rules) {
    if ({}.hasOwnProperty.call(rules, key)) {
      if (query[key]) {
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
}

function filter(params) {
  let message = '';

  const filters = {};

  if (params.toString().length === 0) {
    message = dataJson;
  } else {
    params.forEach((value, name) => {
      filters[name] = value;
      if (name === 'weight') filters[name] = Number(value);
      if (name === 'quantity') filters[name] = Number(value);
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
      if ({}.hasOwnProperty.call(filters, element)) {
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
    if ({}.hasOwnProperty.call(body, key)) {
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

module.exports = {
  notFound,
  filter,
  filterPost,
};
