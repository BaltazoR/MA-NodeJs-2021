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

const { costCalculation } = require('./helper2');

function addCostCalculation(data) {
  const input = data;
  const output = [];
  input.forEach((elem) => {
    const element = elem;
    const price = { price: `$${costCalculation(element)}` };
    output.push({ ...element, ...price });
  });
  return output;
}

module.exports = {
  addCostCalculation,
};
