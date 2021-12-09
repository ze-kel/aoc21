const fs = require('fs');

const file = fs.readFileSync('./input.txt');

const lodash = require('../lodash');

const _clamp = lodash.clamp;

const data = file
  .toString()
  .split('\n')
  .filter((str) => str)
  .map((string) => string.split('').map((el) => Number(el)));

const maxX = data[0].length - 1;
const maxY = data.length - 1;

const getCoord = (x, y) => {
  return data[y][x];
};

const getAdjacent = (x, y) => {
  const adj = [];

  const pairs = [
    [x + 1, y],
    [x - 1, y],
    [x, y + 1],
    [x, y - 1],
  ].filter((pair) => {
    return pair[0] >= 0 && pair[0] <= maxX && pair[1] >= 0 && pair[1] <= maxY;
  });

  pairs.forEach((pair) => {
    adj.push({ coord: pair, val: getCoord(pair[0], pair[1]) });
  });
  return adj;
};

const puzzle1 = () => {
  const lowVals = [];

  for (x = 0; x <= maxX; x++) {
    for (y = 0; y <= maxY; y++) {
      const adj = getAdjacent(x, y);
      const val = getCoord(x, y);

      const adjSmallerOrEqual = adj.find((adjacent) => {
        return val >= adjacent.val;
      });

      if (adjSmallerOrEqual === undefined) {
        lowVals.push(1 + val);
      }
    }
  }
  return lowVals.reduce((a, b) => a + b);
};

console.log('puzzle1', puzzle1());

const buildBasin = (x, y, basinSet) => {
  basinSet.add(`${x}${y}`);
  const val = getCoord(x, y);
  const bigger = getAdjacent(x, y).filter((adjacent) => {
    if (adjacent.val === 9) return false;
    return adjacent.val > val;
  });

  bigger.forEach((place) => {
    buildBasin(place.coord[0], place.coord[1], basinSet);
  });

  return basinSet;
};

const puzzle2 = () => {
  const basins = [];

  for (x = 0; x <= maxX; x++) {
    for (y = 0; y <= maxY; y++) {
      const adj = getAdjacent(x, y);
      const val = getCoord(x, y);

      const adjSmallerOrEqual = adj.find((adjacent) => {
        return val >= adjacent.val;
      });

      if (adjSmallerOrEqual === undefined) {
        const basinSet = new Set();
        buildBasin(x, y, basinSet);
        basins.push(basinSet.size);
      }
    }
  }

  basins.sort((a, b) => b - a);
  return basins[0] * basins[1] * basins[2];
};

console.log('puzzle2', puzzle2());
