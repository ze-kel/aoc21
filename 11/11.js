const fs = require('fs');

const file = fs.readFileSync('./input.txt');

const lodash = require('../lodash');

const _clamp = lodash.clamp;

const data = file
  .toString()
  .split('\n')
  .filter((str) => str)
  .map((string) => string.split('').map((el) => Number(el)));

const dataCopy = lodash.cloneDeep(data);

const maxX = data[0].length - 1;
const maxY = data[1].length - 1;

const getAdjacent = (x, y) => {
  x = Number(x);
  y = Number(y);

  return [
    [x + 1, y],
    [x + 1, y + 1],
    [x + 1, y - 1],
    [x - 1, y],
    [x - 1, y + 1],
    [x - 1, y - 1],
    [x, y + 1],
    [x, y - 1],
  ].filter((pair) => {
    return pair[0] >= 0 && pair[0] <= maxX && pair[1] >= 0 && pair[1] <= maxY;
  });
};

const increaseBy1 = (data) => {
  for (let y = 0; y <= maxY; y++) {
    for (let x = 0; x <= maxX; x++) {
      data[y][x] += 1;
    }
  }
  return data;
};

const flash = (data) => {
  let acc = 0;
  const toFlash = [];
  const flashed = [];

  for (let y = 0; y <= maxY; y++) {
    for (let x = 0; x <= maxX; x++) {
      if (data[y][x] === 10) {
        toFlash.push(`${x}${y}`);
      }
    }
  }

  while (toFlash.length) {
    const coord = toFlash[toFlash.length - 1];
    toFlash.pop();
    if (flashed.includes(coord)) return;
    flashed.push(coord);

    const adjacent = getAdjacent(coord[0], coord[1]);

    adjacent.forEach((coord) => {
      if (data[coord[1]][coord[0]] === 10) return;
      data[coord[1]][coord[0]] += 1;
      if (data[coord[1]][coord[0]] === 10) {
        if (toFlash.includes(coord)) return;
        toFlash.push(coord);
      }
    });
  }

  for (let y = 0; y <= maxY; y++) {
    for (let x = 0; x <= maxX; x++) {
      if (data[y][x] === 10) {
        acc++;
        data[y][x] = 0;
      }
    }
  }

  return acc;
};

const simulateStep = (data) => {
  increaseBy1(data);

  const flashing = flash(data);

  return flashing;
};

const viz = (data) => {
  const rows = data.map((row) => row.join(''));
  rows.forEach((row) => console.log(row));
};

const simulateN = (n, data) => {
  acc = 0;
  for (let i = 0; i < n; i++) {
    acc += simulateStep(data);
    // viz(data);
  }
  return acc;
};

console.log('puzzle1', simulateN(100, data));

const totalOctopuses = data.length * data[0].length;

const findSync = (data) => {
  let step = 1;
  while (step < 1000) {
    const flashed = simulateStep(data);
    if (flashed === totalOctopuses) {
      return step;
    }
    step++;
  }
};

console.log('puzzle2', findSync(dataCopy));
