// I was unable to come up with a usable algoritm
// credits to https://www.reddit.com/r/adventofcode/comments/rlxhmg/2021_day_22_solutions/hpjrsge/?context=3
const fs = require('fs');

const lodash = require('../lodash');

const file = fs.readFileSync('./input.txt');

const data = file
  .toString()
  .split('\n')
  .map((line) => {
    const [state, coords] = line.split(' ');

    const fc = coords.split(',').map((c) => {
      return c
        .split('=')[1]
        .split('..')
        .map((el) => Number(el));
    });

    return {
      mult: state === 'on' ? 1 : -1,
      x: fc[0],
      y: fc[1],
      z: fc[2],
    };
  });

const map = [];

for ({ mult, x, y, z } of data) {
  const invertMap = [];
  for (m of map) {
    const xFrom = Math.max(x[0], m.x[0]);
    const xTo = Math.min(x[1], m.x[1]);
    if (xFrom > xTo) continue;

    const yFrom = Math.max(y[0], m.y[0]);
    const yTo = Math.min(y[1], m.y[1]);
    if (yFrom > yTo) continue;

    const zFrom = Math.max(z[0], m.z[0]);
    const zTo = Math.min(z[1], m.z[1]);
    if (zFrom > zTo) continue;

    const inter = { mult: -m.mult, x: [xFrom, xTo], y: [yFrom, yTo], z: [zFrom, zTo] };

    invertMap.push(inter);
  }

  map.push(...invertMap);

  if (mult === 1) {
    map.push({ mult: 1, x, y, z });
  }
}

const mapCopy = lodash.cloneDeep(map);

const clamper = (val) => lodash.clamp(val, -50, 50);
const isOutOfBounds = (dims) => {
  if (dims[1] <= -50 || dims[0] >= 50) return true;
};

const p1 = mapCopy.reduce((acc, m) => {
  if (isOutOfBounds(m.x) || isOutOfBounds(m.y) || isOutOfBounds(m.z)) {
    return acc;
  }

  return (
    acc +
    (clamper(m.x[1]) - clamper(m.x[0]) + 1) *
      (clamper(m.y[1]) - clamper(m.y[0]) + 1) *
      (clamper(m.z[1]) - clamper(m.z[0]) + 1) *
      m.mult
  );
}, 0);

const p2 = map.reduce((acc, m) => {
  return acc + (m.x[1] - m.x[0] + 1) * (m.y[1] - m.y[0] + 1) * (m.z[1] - m.z[0] + 1) * m.mult;
}, 0);

console.info('puzzle1', p1);

console.info('puzzle2', p2);
