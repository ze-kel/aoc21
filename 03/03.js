const fs = require('fs');

const file = fs.readFileSync('./input.txt');

const data = file.toString().split('\n');

const count = data.reduce((counts, current) => {
  if (!current) return counts;

  current.split('').forEach((el, index) => {
    if (!counts[index]) {
      counts[index] = [0, 0];
    }

    counts[index][el] += 1;
  });

  return counts;
}, []);

const puzzle1binary = count.reduce(
  (strings, count) => {
    const mostCommonIsZero = count[0] > count[1];

    strings.gamma = strings.gamma.concat(mostCommonIsZero ? '0' : '1');
    strings.epsilon = strings.epsilon.concat(mostCommonIsZero ? '1' : '0');

    return strings;
  },
  { gamma: '', epsilon: '' }
);

const puzzle1 = parseInt(puzzle1binary.gamma, 2) * parseInt(puzzle1binary.epsilon, 2);

console.log('puzzle1', puzzle1);

const desiredNumOxygen = (data, index) => {
  const c = [0, 0];
  data.forEach((el) => {
    c[el[index]] += 1;
  });
  return c[0] > c[1] ? '0' : '1';
};

const desiredNumCo = (data, index) => {
  const c = [0, 0];
  data.forEach((el) => {
    c[el[index]] += 1;
  });
  return c[0] > c[1] ? '1' : '0';
};

const puzzle2generic = (getNumF) => {
  let filtered = [...data];
  for (let i = 0; i < filtered[0].length; i++) {
    const target = getNumF(filtered, i);
    filtered = filtered.filter((el) => el[i] === target);
    if (filtered.length === 1) {
      return parseInt(filtered[0], 2);
    }
  }
};

const puzzle2Oxygen = puzzle2generic(desiredNumOxygen);
const puzzle2co2 = puzzle2generic(desiredNumCo);

console.log('puzzle2', puzzle2Oxygen * puzzle2co2);
