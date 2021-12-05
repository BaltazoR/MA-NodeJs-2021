const { Transform } = require('stream');

function getKeys(chunk) {
  let stringChunk = chunk.toString();
  stringChunk = stringChunk.split('\n');
  let key = stringChunk.shift();

  key = key.split(',');
  return key;
}

function parseChunk(chunk, key, fromFirstChunk, first) {
  let incomplete = '';
  let stringChunk = chunk.toString();

  if (fromFirstChunk) stringChunk = fromFirstChunk + stringChunk;

  stringChunk = stringChunk.split('\n');

  stringChunk = stringChunk.filter((el) => el !== '');

  if (first) stringChunk.shift();

  // eslint-disable-next-line array-callback-return
  let output = stringChunk.map((itemRaw) => {
    let item = itemRaw.replaceAll('"', '');

    item = item.replace(/\$\d+,\d+/, (data) => {
      const repl = data.replace(',', '.');
      // repl = repl.replaceAll('"', '');
      return repl;
    });

    item = item.split(',');

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
          return `"${concatKey}": "${value}"`;
        }

        if (key[i] === 'priceType') {
          concatValue = value;
          return;
        }

        if (key[i] === 'priceValue') {
          if (value.indexOf('"') !== -1) console.log('"', value);
          if (value.indexOf(',') !== -1) console.log(',', value);
          // eslint-disable-next-line consistent-return
          return `"${concatValue}": "${value}"`;
        }

        // eslint-disable-next-line consistent-return
        return `"${key[i]}": "${value}"`;
      });

      item = item.filter((el) => el !== undefined);

      return `\n{${item}}`;
      // eslint-disable-next-line no-else-return
    } else {
      incomplete = itemRaw;
      // return incomplete;
    }
    return '';
  });

  output = output.filter((el) => el !== undefined);
  output = `${output.toString()}`;

  return {
    output,
    incomplete,
  };
}

function createCsvToJson() {
  let isFirst = true;
  let fromFirstChunk = '';
  let key = '';

  const transform = (chunk, encoding, callback) => {
    if (isFirst) {
      isFirst = false;

      key = getKeys(chunk);

      const output = parseChunk(chunk, key, null, true);

      const chunkJson = `[${output.output}`;

      fromFirstChunk = output.incomplete;

      return callback(null, chunkJson);
    }

    const output = parseChunk(chunk, key, fromFirstChunk);

    fromFirstChunk = output.incomplete;

    return callback(null, output.output);
  };

  const flush = (callback) => {
    callback(null, '\n]');
  };

  return new Transform({ transform, flush });
}

module.exports = {
  createCsvToJson,
};