const fs = require('fs');

const file = fs.readFileSync('./input.txt');

const lodash = require('../lodash');

const data = file
  .toString()
  .split('\n')
  .filter((str) => str);

const initialStr = data[0];

const rules = data.slice(1).map((line) => {
  const [from, to] = line.split(' -> ');

  return { from, to };
});

const insertInString = (str, letter, index) => {
  return str.slice(0, index) + letter + str.slice(index);
};

const checkRules = (pair) => {
  const rule = rules.find((rule) => {
    return rule.from === pair;
  });
  return rule.to;
};

const stringPass = (str) => {
  let newString = str;
  let indexOffset = 1;

  for (let i = 0; i < str.length - 1; i++) {
    const insertion = checkRules(str[i] + str[i + 1]);
    if (insertion) {
      newString = insertInString(newString, insertion, i + indexOffset);
      indexOffset++;
    }
  }

  return newString;
};

const nPass = (str, n) => {
  for (let i = 0; i < n; i++) {
    str = stringPass(str);
  }
  return str;
};

const countLetters = (string) => {
  const letters = string.split('');

  return lodash
    .uniq(string)
    .map((letter) => {
      return { letter, num: letters.filter((el) => el === letter).length };
    })
    .sort((a, b) => a.num - b.num);
};

const puzzle1 = () => {
  const stringy = nPass(initialStr, 10);

  const count = countLetters(stringy);

  return count[count.length - 1].num - count[0].num;
};

console.log('puzzle1', puzzle1());

///
///
///
///
///

const stringPassOptimized = (pairs) => {
  const saved = lodash.cloneDeep(pairs);

  Object.keys(saved).forEach((key) => {
    const insert = checkRules(key);
    const amount = saved[key];

    pairs[key] -= amount;
    pairs[key[0] + insert] += amount;
    pairs[insert + key[1]] += amount;
  });
};

const nPassOptimized = (pairs, n) => {
  for (let i = 0; i < n; i++) {
    stringPassOptimized(pairs);
  }
};

const generateInitial = (str) => {
  const pairs = {};
  rules.forEach((rule) => {
    pairs[rule.from] = 0;
  });

  for (let i = 0; i < str.length - 1; i++) {
    pairs[str[i] + str[i + 1]] += 1;
  }
  return pairs;
};

const countInPairs = (pairs) => {
  const totalsFirst = {};
  const totalsLast = {};

  Object.keys(pairs).forEach((key) => {
    const amount = pairs[key];
    if (!totalsFirst[key[0]]) {
      totalsFirst[key[0]] = 0;
    }
    if (!totalsLast[key[1]]) {
      totalsLast[key[1]] = 0;
    }

    totalsFirst[key[0]] += amount;
    totalsLast[key[1]] += amount;
  });

  const arr = Object.keys(totalsFirst).map((key) => {
    const num = totalsFirst[key] > totalsLast[key] ? totalsFirst[key] : totalsLast[key];
    return { letter: key, num };
  });

  arr.sort((a, b) => a.num - b.num);
  return arr;
};

const puzzle2 = () => {
  const pairs = generateInitial(initialStr);
  nPassOptimized(pairs, 40);

  const count = countInPairs(pairs);

  return count[count.length - 1].num - count[0].num;
};

console.log('puzzle2', puzzle2());
