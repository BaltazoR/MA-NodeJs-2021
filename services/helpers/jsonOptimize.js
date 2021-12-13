const { Transform: TransformOptimize } = require('stream');

function calc(chunk) {
  const stringChunk = chunk;
  let incomplete = '';
  const accumulator = [];
  const output = [];
  let elem = '';

  stringChunk.forEach((element) => {
    elem = element.trim();
    if (elem.slice(-1) === ']') {
      elem = elem.slice(0, -1);
    }

    if (elem.slice(-1) === '}') {
      elem = elem.slice(0, -1);
      const elementToArray = elem.split(',');
      const elementToJson = JSON.parse(`{${elementToArray}}`);

      if (elementToJson.quantity) {
        const key =
          elementToJson.item + elementToJson.type + elementToJson.pricePerItem;
        // console.log(elementToJson.pricePerItem);
        // console.log(key);
        let count = 0;
        if (accumulator[key]) count = accumulator[key].quantity;

        accumulator[key] = {
          item: elementToJson.item,
          type: elementToJson.type,
          quantity: count + Number(elementToJson.quantity),
          pricePerItem: elementToJson.pricePerItem,
        };
      }

      if (elementToJson.weight) {
        const key =
          elementToJson.item + elementToJson.type + elementToJson.pricePerKilo;
        // console.log(elementToJson.pricePerKilo);
        // console.log(key);
        let count = 0;
        if (accumulator[key]) count = accumulator[key].weight;

        accumulator[key] = {
          item: elementToJson.item,
          type: elementToJson.type,
          weight: count + Number(elementToJson.weight),
          pricePerKilo: elementToJson.pricePerKilo,
        };
      }
    } else {
      incomplete = element;
    }
  });

  // Object.entries(accumulator).forEach((key) => console.log(key));

  Object.values(accumulator).forEach((value) => output.push(value));

  return {
    output,
    incomplete,
  };
}

function optimizeJson() {
  let isFirst = true;
  let fromFirstChunk = '';

  const transform = (chunk, encoding, callback) => {
    if (isFirst) {
      isFirst = false;

      let stringChunk = chunk.toString();

      // console.log(stringChunk);

      stringChunk = stringChunk.substring(2);
      stringChunk = stringChunk.split(',{');

      // console.log(stringChunk);

      const { output, incomplete } = calc(stringChunk);

      fromFirstChunk = incomplete;

      stringChunk = JSON.stringify(output);
      stringChunk = stringChunk.substring(0, stringChunk.length - 1);

      return callback(null, stringChunk);
    }

    let stringChunk = chunk.toString();
    // console.log(stringChunk);

    // stringChunk = stringChunk.substring(2);
    stringChunk = fromFirstChunk + stringChunk;

    fromFirstChunk = '';

    stringChunk = stringChunk.split(',{');

    // console.log(stringChunk);

    const { output, incomplete } = calc(stringChunk);

    fromFirstChunk = incomplete;

    stringChunk = JSON.stringify(output);
    stringChunk = stringChunk.substring(1, stringChunk.length - 1);

    // console.log('str - ', stringChunk);

    if (stringChunk !== '') stringChunk = `,${stringChunk}`;

    return callback(null, stringChunk);
  };

  const flush = (callback) => {
    callback(null, ']\n');
  };

  return new TransformOptimize({ transform, flush });
}

module.exports = {
  optimizeJson,
  calc,
};
