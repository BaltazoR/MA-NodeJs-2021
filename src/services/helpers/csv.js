module.exports = (body) => {
  let input = body.toString();
  input = input.split('\n');
  let key = input.shift();
  key = key.toLowerCase();
  key = key.split(',');

  input = input.filter((el) => el !== '');

  // eslint-disable-next-line array-callback-return,consistent-return
  let output = input.map((itemRaw) => {
    let item = itemRaw.replace('"', '');

    item = item.replace(/(\d+),(\d+)/, '$1.$2');
    item = item
      .split(',')
      .map((element) => element.replace('.', ','))
      .map((element) => element.replace('"', ''));

    if (key.length === item.length) {
      item = item.map((value, i) => [key[i], value]);

      item = item.filter((el) => el !== undefined);

      return Object.fromEntries(item);
    }
  });

  output = output.filter((el) => el !== '');

  return output;
};
