const util = require('util');
const inputJson = require('../../data.json');
const discount = require('../discount');

function priceNormalization(price) {
  return price.substring(1).replace(/,/, '.');
}

function costCalculation(input) {
  let price;
  let quantity;

  if (input.pricePerItem) {
    price = priceNormalization(input.pricePerItem);
    quantity = input.quantity;
  } else {
    price = priceNormalization(input.pricePerKilo);
    quantity = input.weight;
  }
  return price * quantity;
}

function discountCalculation(input, disc) {
  let price;

  if (input.pricePerItem) {
    price = priceNormalization(input.pricePerItem);
  } else {
    price = priceNormalization(input.pricePerKilo);
  }
  price *= (100 - disc) / 100;

  if (input.type === 'Red Spanish') {
    price *= (100 - disc) / 100;
  }

  if (input.type === 'Tangerine') {
    price *= (100 - disc) / 100;
    price *= (100 - disc) / 100;
  }

  return price.toFixed(2);
}

// eslint-disable-next-line
function compareByCost(a, b) {
  const aKey = costCalculation(a);
  const bKey = costCalculation(b);

  if (aKey > bKey) return 1;
  if (aKey === bKey) return 0;
  if (aKey < bKey) return -1;
}

function searchHighestCost(input = inputJson) {
  const sortArray = input.slice();
  return sortArray.sort(compareByCost).pop();
}

function discountPromise() {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line consistent-return
    discount((err, response) => {
      if (err) {
        // return resolve(discountPromise());
        reject(err);
      }
      resolve(response);
    });
  });
}

const discountPromisify = util.promisify(discount);

module.exports = {
  searchHighestCost,
  costCalculation,
  discountPromise,
  discountCalculation,
  discountPromisify,
};
