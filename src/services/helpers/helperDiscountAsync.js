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
    itemsData.map(async (item) => {
      try {
        // eslint-disable-next-line no-shadow
        const discount = await discountAsync();
        const priceWithDiscount = discountCalculation(item, discount);

        return Object.assign(item, {
          priceWithDiscount,
          discount: `${discount}%`,
        });
      } catch (err) {
        console.log(err);
        return err;
      }
    }),
  );

  return result;
};
