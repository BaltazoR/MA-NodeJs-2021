// const util = require('util');
const inputJson = require('../../../data.json');
// const { discount } = require('../discount');

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

// const discountPromisify = util.promisify(discount);

module.exports = {
  searchHighestCost,
  costCalculation,
  priceNormalization,
  // discountPromise,
  // discountPromisify,
};
