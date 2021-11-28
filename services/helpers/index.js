const helper1 = require('./helper1');
const helper2 = require('./helper2');
const helper3 = require('./helper3');

const discountPromise = require('./helperDiscountPromise');
const discountPromisify = require('./helperDiscountPromisify');
const discountAsync = require('./helperDiscountAsync');

module.exports = {
  helper1,
  helper2,
  helper3,
  discountPromise,
  discountPromisify,
  discountAsync,
};
