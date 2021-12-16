const fs = require('fs');

const file = fs.readFileSync('./input.txt');

const lodash = require('../lodash');

const data = file
  .toString()
  .split('')
  .filter((str) => str);

const shouldLog = false;

const logger = (...args) => {
  if (shouldLog) {
    console.log(...args);
  }
};

const binaryMap = {
  0: '0000',
  1: '0001',
  2: '0010',
  3: '0011',
  4: '0100',
  5: '0101',
  6: '0110',
  7: '0111',
  8: '1000',
  9: '1001',
  A: '1010',
  B: '1011',
  C: '1100',
  D: '1101',
  E: '1110',
  F: '1111',
};

const hex2bin = (hex) => {
  return binaryMap[hex];
};

const binary = data.map((letter) => hex2bin(letter)).join('');

const packetOperation = (id, elements) => {
  switch (String(id)) {
    case '0':
      if (elements.length === 1) return elements[0];
      return elements.reduce((a, b) => a + b);
    case '1':
      if (elements.length === 1) return elements[0];
      return elements.reduce((a, b) => a * b);
    case '2':
      return Math.min(...elements);
    case '3':
      return Math.max(...elements);
    case '5':
      return elements[0] > elements[1] ? 1 : 0;
    case '6':
      return elements[0] < elements[1] ? 1 : 0;
    case '7':
      return elements[0] === elements[1] ? 1 : 0;
  }
};

const processPacket = (string) => {
  const version = string.slice(0, 3);
  const id = string.slice(3, 6);
  let rest = string.slice(6);
  let versionSum = 0;

  const versionDecimal = parseInt(version, 2);
  const idDecimal = parseInt(id, 2);

  versionSum += versionDecimal;

  let value = null;

  if (idDecimal === 4) {
    let buildValue = [];
    let cont = true;

    while (cont) {
      const five = rest.slice(0, 5);

      if (five[0] === '0') {
        cont = false;
      }

      rest = rest.slice(5);
      buildValue.push(five.slice(1));
    }

    value = parseInt(buildValue.join(''), 2);
  } else {
    const lengthTypeId = rest[0];
    rest = rest.slice(1);

    let buildValue = [];

    if (lengthTypeId === '0') {
      const operateOn = rest.slice(0, 15);
      rest = rest.slice(15);

      const subLenToRead = parseInt(operateOn, 2);

      let read = 0;

      while (read < subLenToRead) {
        const result = processPacket(rest);

        read += rest.length - result.rest.length;

        rest = result.rest;
        versionSum += result.versionSum;

        buildValue.push(result.value);
      }
    } else {
      const operateOn = rest.slice(0, 11);
      rest = rest.slice(11);

      const subsToRead = parseInt(operateOn, 2);

      let read = 0;

      while (read < subsToRead) {
        const result = processPacket(rest);

        read += 1;

        rest = result.rest;
        versionSum += result.versionSum;

        buildValue.push(result.value);
      }
    }
    value = packetOperation(idDecimal, buildValue);
  }

  return { value, rest, versionSum };
};

const res = processPacket(binary);

console.log('puzzle1', res.versionSum);

console.log('puzzle2', res.value);
