const fs = require('fs');

const file = fs.readFileSync('./input.txt');

const lodash = require('../lodash');

const target = {
  x: {
    from: 156,
    to: 202,
  },
  y: {
    from: -110,
    to: -69,
  },
};

const inArea = (x, y, target) => {
  const xIn = x >= target.x.from && x <= target.x.to;
  const yIn = y >= target.y.from && y <= target.y.to;
  return xIn && yIn;
};

const simulateStep = (cur) => {
  const x = cur.x + cur.xVel;
  const y = cur.y + cur.yVel;

  const xVel = Math.max(cur.xVel - 1, 0);
  const yVel = cur.yVel - 1;

  return { x, y, xVel, yVel };
};

const simulateShot = (xVel, yVel, target) => {
  let current = { x: 0, y: 0, xVel, yVel };
  let maxY = 0;
  let reached = false;
  let iteration = 0;

  const maxIteration = 250;

  while (current.x < target.x.to && current.y > target.y.from && !reached && iteration < maxIteration) {
    const step = simulateStep(current);
    if (maxY < step.y) {
      maxY = step.y;
    }
    if (inArea(step.x, step.y, target)) {
      reached = true;
    }

    iteration++;

    current = step;
  }

  let status = 'sucess';
  if (!reached) {
    status = iteration === maxIteration ? 'under' : 'over';
  }

  return { xVel, yVel, reached, maxY, status };
};

const bruteForce = (target) => {
  const xLow = 0;
  const xHigh = target.x.to;

  const yLow = target.y.from;
  const yHigh = target.x.to + target.y.to;

  const sucessful = [];

  for (let x = xLow; x <= xHigh; x++) {
    for (let y = yLow; y <= yHigh; y++) {
      const attempt = simulateShot(x, y, target);

      if (attempt.reached) {
        sucessful.push(attempt);
      }
    }
  }

  const best = sucessful.reduce((maxxx, el) => {
    return el.maxY > maxxx ? el.maxY : maxxx;
  }, 0);
  const total = sucessful.length;

  return { best, total };
};

const result = bruteForce(target);

console.log('puzzle1', result.best);

console.log('puzzle2', result.total);
