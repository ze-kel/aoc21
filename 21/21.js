const lodash = require('../lodash');

const initial = {
  p1: { pos: 8, score: 0 },
  p2: { pos: 2, score: 0 },
};

const roller = {
  currentVal: 0,
  getVal() {
    this.currentVal += 1;
    return this.currentVal;
  },
  getRolledTimes() {
    return this.currentVal;
  },
  reset() {
    this.currentVal = 0;
  },
};

const getPositionScore = (position) => {
  if (position < 11) return position;
  const remainder = position % 10;
  return remainder === 0 ? 10 : remainder;
};

const simulateStep = (player) => {
  const rolls = Array(3)
    .fill(0)
    .map((_) => roller.getVal());

  player.pos = player.pos + lodash.sum(rolls);

  player.score = player.score + getPositionScore(player.pos);

  if (player.score >= 1000) {
    return true;
  }
  return false;
};

const play = () => {
  let winner = false;
  let player2Turn = false;

  roller.reset();

  const players = lodash.cloneDeep(initial);

  let max = 0;

  while (!winner) {
    winner = simulateStep(players[player2Turn ? 'p2' : 'p1']);
    player2Turn = !player2Turn;
    max++;
  }

  return players;
};

const puzzle1 = () => {
  const result = play();
  const rolledTimes = roller.getRolledTimes();

  const loser = result.p1.score < result.p2.score ? result.p1 : result.p2;

  return loser.score * rolledTimes;
};

console.log('puzzle1', puzzle1());

const getPossible = () => {
  const possibilities = [];
  for (i of [1, 2, 3]) {
    for (z of [1, 2, 3]) {
      for (x of [1, 2, 3]) {
        possibilities.push(i + z + x);
      }
    }
  }
  return possibilities;
};

const possible = getPossible();

const cache = {};

const makeCacheHash = (p1, p2, rollNumber) => {
  return `${p1.pos} ${p1.score} ${p2.pos} ${p2.score} ${rollNumber}`;
};

const findWins = (p1, p2, rollNumber) => {
  const hash = makeCacheHash(p1, p2, rollNumber);

  let res = [0, 0];

  if (!cache[hash]) {
    if (p1.score >= 21 || p2.score >= 21) {
      if (p1.score >= 21) {
        res[0] += 1;
      }
      if (p2.score >= 21) {
        res[1] += 1;
      }
      return res;
    } else {
      possible.forEach((rollResult) => {
        const newP1 = { ...p1 };
        const newP2 = { ...p2 };

        const targetPlayer = rollNumber % 2 === 0 ? newP2 : newP1;

        targetPlayer.pos = targetPlayer.pos + rollResult;

        targetPlayer.score = targetPlayer.score + getPositionScore(targetPlayer.pos);

        const wins = findWins(newP1, newP2, rollNumber + 3);
        res[0] += wins[0];
        res[1] += wins[1];
      });
      cache[hash] = res;
    }
  } else {
    res = cache[hash];
  }

  return [res[0], res[1]];
};

const puzzle2 = () => {
  const total = findWins(initial.p1, initial.p2, 1, 1);
  return Math.max(...total);
};

console.log('puzzle2', puzzle2());
