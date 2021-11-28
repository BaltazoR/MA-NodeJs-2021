const { priceNormalization } = require('./helpers/helper2');

function generateRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function discount(callback) {
  const randomDelay = generateRandomInteger(0, 1000);
  setTimeout(() => {
    const randomNumber = generateRandomInteger(1, 50);
    if (randomNumber > 35) {
      callback(new Error('Something went wrong'));
    } else callback(null, randomNumber);
  }, randomDelay);
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

module.exports = {
  discount,
  discountCalculation,
};
