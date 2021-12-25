const fs = require('fs');

const file = fs.readFileSync('./input.txt');

const lodash = require('../lodash');

const data = file
  .toString()
  .split('\n')
  .map((block) => {
    return block.split('');
  });

const maxY = data.length - 1;
const maxX = data[0].length - 1;

const getSet = (map, x, y, val) => {
  if (x > maxX) {
    x = 0;
  }
  if (y > maxY) {
    y = 0;
  }

  if (val) {
    map[y][x] = val;
  } else {
    return map[y][x];
  }
};

const moveIteration = (map) => {
  const moveHor = [];

  for (let x = 0; x <= maxX; x++) {
    for (let y = 0; y <= maxY; y++) {
      const valueAtCoord = getSet(map, x, y);
      if (valueAtCoord === '>') {
        const moveTo = getSet(map, x + 1, y);
        if (moveTo === '.') {
          moveHor.push([x, y]);
        }
      }
    }
  }

  moveHor.forEach(([x, y]) => {
    getSet(map, x, y, '.');
    getSet(map, x + 1, y, '>');
  });

  const moveVert = [];

  for (let x = 0; x <= maxX; x++) {
    for (let y = 0; y <= maxY; y++) {
      const valueAtCoord = getSet(map, x, y);
      if (valueAtCoord === 'v') {
        const moveTo = getSet(map, x, y + 1);
        if (moveTo === '.') {
          moveVert.push([x, y]);
        }
      }
    }
  }

  moveVert.forEach(([x, y]) => {
    getSet(map, x, y, '.');
    getSet(map, x, y + 1, 'v');
  });

  return moveHor.length + moveVert.length;
};

const viz = (data) => {
  data.forEach((line) => {
    console.log(line.join(''));
  });
};

let iter = 1;
let more = true;

while (more) {
  const moved = moveIteration(data);
  console.log(`ITER ${iter} | MOVED ${moved}`);
  if (moved === 0) {
    more = false;
  } else {
    iter++;
  }
}
console.log('PUZZLE1', iter);
