const fs = require('fs');

const file = fs.readFileSync('./input.txt');

const lodash = require('../lodash');

const data = file
  .toString()
  .split('\n')[0]
  .split(',')
  .map((el) => Number(el));

const dataCopy = lodash.cloneDeep(data);

const simulateDayNaive = (arr) => {
  const initialLen = arr.length;
  for (let i = 0; i < initialLen; i++) {
    if (arr[i] === 0) {
      arr[i] = 6;
      arr.push(8);
    } else {
      arr[i] -= 1;
    }
  }
  return arr;
};

const simulateDaysNaive = (arr, nnn) => {
  for (let i = 0; i < nnn; i++) {
    simulateDayNaive(arr);
  }
  return arr;
};

const naive = simulateDaysNaive(data, 80);
console.log('puzle1', naive.length);

const simulateDayOptimized = (arr) => {
  const first = arr[0];
  arr.shift();
  arr[6].fish += first.fish;
  arr.push(first);
  return arr;
};

const simulateDaysOptimized = (arr, nnn) => {
  const initial = Array(9)
    .fill('temp')
    .map((_) => ({
      fish: 0,
    }));

  arr.forEach((fish) => {
    initial[fish].fish += 1;
  });

  for (let i = 0; i < nnn; i++) {
    simulateDayOptimized(initial);
  }
  return initial;
};

const optimized = simulateDaysOptimized(dataCopy, 256);

console.log(
  'puzzle2',
  optimized.map((el) => el.fish).reduce((a, b) => a + b)
);
