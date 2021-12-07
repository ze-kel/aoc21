const fs = require('fs');

const file = fs.readFileSync('./input.txt');

const data = file
  .toString()
  .split('\n')[0]
  .split(',')
  .map((el) => Number(el));

const getMoveCostSimple = (from, to) => {
  return Math.abs(from - to);
};

const getCostToAlign = (crabs, moveCost) => {
  const maxPos = Math.max(...crabs);

  const costs = Array(maxPos).fill(0);

  crabs.forEach((from) => {
    for (let i = 0; i < costs.length; i++) {
      costs[i] += moveCost(from, i);
    }
  });

  return costs;
};

console.log('puzzle1', Math.min(...getCostToAlign(data, getMoveCostSimple)));

const getMoveCostComplex = (from, to) => {
  const distance = Math.abs(from - to);
  return (distance * (distance + 1)) / 2;
};

console.log('puzzle2', Math.min(...getCostToAlign(data, getMoveCostComplex)));
