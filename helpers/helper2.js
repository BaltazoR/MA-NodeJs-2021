// Створити функцію, для пошуку запису з найбільшою вартістю.
// Функція прийматиме масив товарів із тестового завдання,
// та повертає запис із найбільшою вартістю.
// (враховуючи кількість)
// Якщо при виклику функції, дані відсутні,
// прочитати їх безпосередньо із JSON файлу.
// (без використання бібліотек)
// Експортувати цю функцію для підключення в майбутньому.

const inputJson = require('../data.json');

function priceNormalization(price) {
  return price.substring(1).replace(/,/, '.');
}

// eslint-disable-next-line
function compareByCost(a, b) {
  let aKey = a.pricePerKilo || a.pricePerItem;
  let bKey = b.pricePerKilo || b.pricePerItem;

  aKey = Number(priceNormalization(aKey)) * (a.weight || a.quantity);
  bKey = Number(priceNormalization(bKey)) * (b.weight || b.quantity);

  if (aKey > bKey) return 1;
  if (aKey === bKey) return 0;
  if (aKey < bKey) return -1;
}

function searchHighestCost(input = inputJson) {
  const sortArray = input.slice();
  return sortArray.sort(compareByCost).pop();
}

module.exports = {
  searchHighestCost,
};
