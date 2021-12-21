const util = require('util');
const { discount, discountCalculation } = require('../discount');

const getDiscount = util.promisify(discount);

function getDiscountAlways(item) {
  return (
    getDiscount()
      // eslint-disable-next-line no-shadow
      .then((discount) => {
        const priceWithDiscount = discountCalculation(item, discount);
        return Object.assign(item, {
          priceWithDiscount,
          discount: `${discount}%`,
        });
      })
      .catch(() => getDiscountAlways(item))
  );
}

// eslint-disable-next-line arrow-body-style
module.exports = (data) => {
  const itemsData = JSON.parse(JSON.stringify(data));
  return Promise.all(itemsData.map((item) => getDiscountAlways(item)));
};
