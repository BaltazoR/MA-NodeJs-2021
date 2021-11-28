const { discount, discountCalculation } = require('../discount');

async function discountAsync() {
  const result = await new Promise((resolve) => {
    discount((err, response) => {
      if (err) {
        return resolve(discountAsync());
      }
      return resolve(response);
    });
  });
  return result;
}

module.exports = async (data) => {
  const itemsData = JSON.parse(JSON.stringify(data));

  const result = await Promise.all(
    itemsData.map((item) =>
      // eslint-disable-next-line no-shadow
      discountAsync().then((discount) => {
        const priceWithDiscount = discountCalculation(item, discount);
        return Object.assign(item, {
          priceWithDiscount,
          discount: `${discount}%`,
        });
      }),
    ),
  );

  return result;
};
