// В файлі index.js підключити всі 3 модулі (helper1, helper2, helper3)
// та експортувати їх одним об'єктом, використовуючи module.exports

const helper1 = require('./helper1');
const helper2 = require('./helper2');
const helper3 = require('./helper3');

module.exports = {
  helper1,
  helper2,
  helper3,
};
