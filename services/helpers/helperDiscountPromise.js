const { discount, discountCalculation } = require('../discount');

function discountPromise() {
  return new Promise((resolve) => {
    // eslint-disable-next-line consistent-return
    discount((err, response) => {
      if (err) {
        return resolve(discountPromise());
        // reject(err);
      }
      return resolve(response);
    });
  });
}

// eslint-disable-next-line arrow-body-style
module.exports = (data) => {
  const itemsData = JSON.parse(JSON.stringify(data));
  return Promise.all(
    itemsData.map((item) =>
      // eslint-disable-next-line no-shadow
      discountPromise().then((discount) => {
        const priceWithDiscount = discountCalculation(item, discount);
        return Object.assign(item, {
          priceWithDiscount,
          discount: `${discount}%`,
        });
      }),
    ),
  );
};
