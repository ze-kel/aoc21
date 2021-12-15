const fs = require('fs');

const file = fs.readFileSync('./input.txt');

const lodash = require('../lodash');

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
  return [
    [x + 1, y],
    [x - 1, y],
    [x, y + 1],
    [x, y - 1],
  ].filter((pair) => {
    return pair[0] >= 0 && pair[0] <= maxX && pair[1] >= 0 && pair[1] <= maxY;
  });
};

let cheapestDataMap = [[0]];

const saveCheapestInfo = (coord, val, base) => {
  const [x, y] = coord;

  if (!cheapestDataMap[y]) {
    cheapestDataMap[y] = [];
  }

  if (!cheapestDataMap[y][x] || cheapestDataMap[y][x] > val + base) {
    cheapestDataMap[y][x] = base + val;
  }
};

const getCheapestInfo = (coord) => {
  const [x, y] = coord;
  if (!cheapestDataMap[y]) return 0;
  if (!cheapestDataMap[y][x]) return 0;
  return cheapestDataMap[y][x];
};

let visitedMad = [];

const saveVisited = (coord) => {
  const [x, y] = coord;

  if (!visitedMad[y]) {
    visitedMad[y] = [];
  }

  visitedMad[y][x] = true;
};

const getVisited = (coord) => {
  const [x, y] = coord;
  if (!visitedMad[y]) return false;
  return visitedMad[y][x];
};

const findCheapestPath = (getCoord, getAdjacent) => {
  let toVisit = [[0, 0]];

  while (toVisit.length) {
    const current = toVisit.reduce(
      (acc, el) => {
        const costToEl = getCheapestInfo(el);
        if (costToEl < acc.cost) {
          return { coord: el, cost: costToEl };
        }
        return acc;
      },
      { coord: toVisit[0], cost: getCheapestInfo(toVisit[0]) }
    );

    const { coord, cost } = current;

    const adj = getAdjacent(...coord);

    adj.forEach((adjCoord) => {
      const toCoord = getCoord(...adjCoord);
      saveCheapestInfo(adjCoord, toCoord, cost);
    });

    const filtered = adj.filter((val) => !getVisited(val));

    filtered.forEach((el) => toVisit.push(el));

    saveVisited(coord);

    toVisit = toVisit.filter((val) => !getVisited(val));
  }
};

const puzzle1 = () => {
  findCheapestPath(getCoord, getAdjacent);

  return cheapestDataMap[maxY][maxX];
};

console.log('p1', puzzle1());

const plusLine = (line, val) => {
  return line.map((el) => {
    let res = el + Number(val);
    if (res > 9) {
      res = res - 9;
    }
    return res;
  });
};

const produceBigData = () => {
  const bigX = data.map((line) => {
    return Array(5)
      .fill(0)
      .map((_, i) => plusLine(line, i));
  });

  const flatbigX = bigX.map((line) => lodash.flatten(line));

  const addY = [];

  for (let i = 1; i < 5; i++) {
    flatbigX.forEach((line) => {
      const newLine = plusLine(line, i);
      addY.push(newLine);
    });
  }
  return [...flatbigX, ...addY];
};

const bigData = produceBigData();

// bigData.forEach((line) => console.log(line.join(',')));

const getCoordBig = (x, y) => {
  return bigData[y][x];
};

const maxXBIG = bigData[0].length - 1;
const maxYBIG = bigData.length - 1;

const getAdjacentBig = (x, y) => {
  return [
    [x + 1, y],
    [x - 1, y],
    [x, y + 1],
    [x, y - 1],
  ].filter((pair) => {
    return pair[0] >= 0 && pair[0] <= maxXBIG && pair[1] >= 0 && pair[1] <= maxYBIG;
  });
};

const puzzle2 = () => {
  cheapestDataMap = [0];
  visitedMad = [];
  findCheapestPath(getCoordBig, getAdjacentBig);

  return cheapestDataMap[maxYBIG][maxXBIG];
};

console.log('p2', puzzle2());
