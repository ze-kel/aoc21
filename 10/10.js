const fs = require('fs');

const file = fs.readFileSync('./input.txt');

const lodash = require('../lodash');

const data = file
  .toString()
  .split('\n')
  .filter((el) => el);

const valueMap = {
  '(': { val: 'round', action: 'add' },
  ')': { val: 'round', action: 'remove' },
  '[': { val: 'square', action: 'add' },
  ']': { val: 'square', action: 'remove' },
  '{': { val: 'figure', action: 'add' },
  '}': { val: 'figure', action: 'remove' },
  '<': { val: 'pointy', action: 'add' },
  '>': { val: 'pointy', action: 'remove' },
};

const isError = (stackArray, symbol) => {
  const todo = valueMap[symbol];

  if (todo.action === 'add') {
    stackArray.push(todo.val);
  } else {
    if (stackArray[stackArray.length - 1] !== todo.val) {
      return false;
    }
    stackArray.pop();
  }
  return true;
};

const prices1 = {
  ')': 3,
  ']': 57,
  '}': 1197,
  '>': 25137,
};

const checkLine = (line) => {
  const stack = [];
  for (i = 0; i < line.length; i++) {
    const symbol = line[i];
    if (!isError(stack, symbol)) {
      return symbol;
    }
  }
  return stack;
};

const puzzle1 = () => {
  let acc = 0;

  data.forEach((line) => {
    const result = checkLine(line);
    if (typeof result === 'string') {
      acc += prices1[result];
    }
  });

  return acc;
};

console.log('puzzle1', puzzle1());

const prices2 = {
  ')': 1,
  ']': 2,
  '}': 3,
  '>': 4,
};

const complimentary = {
  round: ')',
  square: ']',
  figure: '}',
  pointy: '>',
};

const completeCost = (arr) => {
  let acc = 0;
  for (i = arr.length - 1; i >= 0; i--) {
    acc = acc * 5 + prices2[complimentary[arr[i]]];
  }
  return acc;
};

const puzzle2 = () => {
  const costs = [];

  data.forEach((line) => {
    const result = checkLine(line);
    if (typeof result !== 'string') {
      costs.push(completeCost(result));
    }
  });

  costs.sort((a, b) => a - b);

  return costs[Math.floor(costs.length / 2)];
};

console.log('puzzle2', puzzle2());
