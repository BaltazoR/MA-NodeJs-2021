// використовуючи деструктуризацію, підключити папку helpers
// та змінити назву для helper1, helper2 та helper3
// на інтуїтивно зрозумілі.

// Створити функцію boot, яка приймає як параметр масив товарів
// із тестового завдання і виконує в своєму тілі послідовно такі дії:
// виконати переназвану функцію helper3 масивом товарів з тестового завдання
// та вивести результати через console.log;
// викликати функцію helper1 з параметрами фільтрування
// “item”: “orange” та  “weight”: “4”
// вивести результати через console.log;
// виконати переназвану функцію helper2 з товарами
// отриманими з попереднього кроку та вивести результат через console.log
// об’єднати результати з попереднього кроку та викликати  функцію
// з модуля helper3, вивести результат через console.log;
// виконати переназвану функцію helper2 без аргументів та
// вивести результат через console.log

// Викликати функцію boot з масивом даних

const dataJson = require('./data.json');

const {
  helper1: filter,
  helper2: searchHighestCost,
  helper3: costCalculation,
} = require('./helpers');

function boot(data) {
  const input = data;
  console.log(costCalculation.costCalculation(input));

  const filterByItem = filter.filter(data, 'item', 'orange');
  const filterByWeight = filter.filter(data, 'weight', 4);
  console.log(filterByItem);
  console.log(filterByWeight);

  const highestCostByItem = searchHighestCost.searchHighestCost(filterByItem);
  const highestCostByWeight =
    searchHighestCost.searchHighestCost(filterByWeight);
  console.log(highestCostByItem);
  console.log(highestCostByWeight);

  const pooledResults = [];
  pooledResults.push(highestCostByItem, highestCostByWeight);
  console.log(costCalculation.costCalculation(pooledResults));

  console.log(searchHighestCost.searchHighestCost());
}

boot(dataJson);
