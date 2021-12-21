/* eslint-disable consistent-return */
function create(req) {
  let input = req.body.toString();
  input = input.split('\n');
  let key = input.shift();
  key = key.split(',');

  input = input.filter((el) => el !== '');

  // eslint-disable-next-line array-callback-return
  let output = input.map((itemRaw) => {
    let item = itemRaw.replace('"', '');

    item = item.replace(/(\d+),(\d+)/, '$1.$2');
    item = item
      .split(',')
      .map((element) => element.replace('.', ','))
      .map((element) => element.replace('"', ''));

    let concatKey = '';
    let concatValue = '';

    if (key.length === item.length) {
      item = item.map((value, i) => {
        if (key[i] === 'measure') {
          concatKey = value;
          return;
        }

        if (key[i] === 'measureValue') {
          // eslint-disable-next-line consistent-return
          return [concatKey, value];
        }

        if (key[i] === 'priceType') {
          concatValue = value;
          return;
        }

        if (key[i] === 'priceValue') {
          // eslint-disable-next-line consistent-return
          return [concatValue, value];
        }

        // eslint-disable-next-line consistent-return
        return [key[i], value];
      });

      item = item.filter((el) => el !== undefined);

      return Object.fromEntries(item);
    }
  });

  output = output.filter((el) => el !== '');

  return output;
}

function optimize(json) {
  const accumulator = [];

  const output = [];

  json.forEach((element) => {
    if (element.quantity) {
      const key = element.item + element.type + element.pricePerItem;
      let count = 0;
      if (accumulator[key]) count = accumulator[key].quantity;

      accumulator[key] = {
        item: element.item,
        type: element.type,
        quantity: count + Number(element.quantity),
        pricePerItem: element.pricePerItem,
      };
    }

    if (element.weight) {
      const key = element.item + element.type + element.pricePerKilo;

      let count = 0;
      if (accumulator[key]) count = accumulator[key].weight;

      accumulator[key] = {
        item: element.item,
        type: element.type,
        weight: count + Number(element.weight),
        pricePerKilo: element.pricePerKilo,
      };
    }
  });

  Object.values(accumulator).forEach((value) => output.push(value));

  return output;
}

function createCsv(req) {
  const jsonNotOptimize = create(req);
  return optimize(jsonNotOptimize);
}

module.exports = {
  createCsv,
};
