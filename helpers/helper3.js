// Створити функцію, для розрахунку вартості запису товару,
// та дописати її як ключ “price”:
// {
//  “item”: String value,
//  “type”: String value,
//  ...
//  “price”: number
// }
// (бажано використати залишковий оператор(“Spread”))
// Експортувати цю функцію через для підключення в майбутньому.

function priceNormalization(price) {
  return price.substring(1).replace(/,/, '.');
}

function costCalculation(data) {
  const input = data;
  input.forEach((elem) => {
    const element = elem;
    const price =
      priceNormalization(element.pricePerKilo || element.pricePerItem) *
      (element.weight || element.quantity);
    element.price = price;
  });
  return input;
}

module.exports = {
  costCalculation,
};
