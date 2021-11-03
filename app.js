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

function consoleLog(message, output) {
  console.log(`${message} = ${JSON.stringify(output)}`);
  console.log('\r\n');
}

const {
  helper1: filter,
  helper2: searchHighestCost,
  helper3: addCostCalculation,
} = require('./helpers');

function boot(data) {
  const input = data;
  const costCalculation = addCostCalculation.addCostCalculation(input);
  consoleLog('cost Calculation', costCalculation);

  const filterByItem = filter.filter(data, 'item', 'orange');
  const filterByWeight = filter.filter(data, 'weight', 4);
  consoleLog('filterByItem', filterByItem);
  consoleLog('filterByWeight', filterByWeight);

  const highestCostByItem = searchHighestCost.searchHighestCost(filterByItem);
  const highestCostByWeight =
    searchHighestCost.searchHighestCost(filterByWeight);
  consoleLog('highestCostByItem', highestCostByItem);
  consoleLog('highestCostByWeight', highestCostByWeight);

  const pooledResults = [];
  pooledResults.push(highestCostByItem, highestCostByWeight);
  consoleLog(
    'pooledResults',
    addCostCalculation.addCostCalculation(pooledResults),
  );

  consoleLog(
    'searchHighestCost without arguments',
    searchHighestCost.searchHighestCost(),
  );
}

boot(dataJson);
