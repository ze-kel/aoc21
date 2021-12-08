const fs = require('fs');

const file = fs.readFileSync('./input.txt');

const lodash = require('../lodash');

const _intersection = lodash.intersection;
const _isEqual = lodash.isEqual;

const data = file
  .toString()
  .split('\n')
  .filter((el) => el)
  .map((el) => {
    const split = el.split(' | ');

    return { input: split[0].split(' '), output: split[1].split(' ') };
  });

const dataCopy = lodash.cloneDeep(data);

const easyNumbers = data.map((el) => {
  el.output = el.output.map((code) => {
    if (code.length == 2) return 1;
    if (code.length === 3) return 7;
    if (code.length === 4) return 4;
    if (code.length === 7) return 8;
    return code;
  });
  return el;
});

const puzzle1 = easyNumbers.reduce((acc, el) => {
  el.output.forEach((element) => {
    if (typeof element === 'number') {
      acc += 1;
    }
  });
  return acc;
}, 0);

console.log('puzzle1', puzzle1);

const decode = dataCopy.map((el) => {
  let codes = [];
  [...el.input, ...el.output].forEach((codeSTR) => {
    code = codeSTR.split('');
    if (code.length == 2) {
      codes[1] = code;
    }
    if (code.length === 3) {
      codes[7] = code;
    }
    if (code.length === 4) {
      codes[4] = code;
    }
    if (code.length === 7) {
      codes[8] = code;
    }
  });

  [...el.input, ...el.output].forEach((codeSTR) => {
    code = codeSTR.split('');
    if (code.length == 5) {
      if (_intersection(code, codes[7]).length === codes[7].length) {
        codes[3] = code;
        return;
      }
      if (_intersection(code, codes[4]).length === 3) {
        codes[5] = code;
        return;
      }
      codes[2] = code;
    }
    if (code.length === 6) {
      if (_intersection(code, codes[4]).length === codes[4].length) {
        codes[9] = code;
        return;
      }
      if (_intersection(code, codes[7]).length === codes[7].length) {
        codes[0] = code;
        return;
      }
      codes[6] = code;
    }
  });

  codes = codes.map((code) => code.sort());
  el.output = el.output.map((code) => {
    return codes.findIndex((possibleCode) => {
      if (possibleCode.length !== code.length) {
        return false;
      }
      return _intersection(code.split(''), possibleCode).length == possibleCode.length;
    });
  });

  console.log(el.output);

  return Number(el.output.join(''));
});

console.log('decode', decode);

const puzzle2 = decode.reduce((a, b) => a + b);

console.log('puzzle2', puzzle2);
