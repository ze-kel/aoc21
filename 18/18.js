const fs = require('fs');

const file = fs.readFileSync('./input.txt');

const lodash = require('../lodash');

const data = file
  .toString()
  .split('\n')
  .filter((str) => str)
  .map((el) => JSON.parse(el));

const dataCopy = lodash.cloneDeep(data);

const add = (a, b) => {
  return [a, b];
};

const getByPath = (arr, path) => {
  let target = arr;
  while (path.length > 1) {
    target = target[path[0]];
    path = path.slice(1);
  }
  const beforeVal = target[path[0]];
  return beforeVal;
};

const assignByPath = (arr, path, value) => {
  let target = arr;
  while (path.length > 1) {
    target = target[path[0]];
    path = path.slice(1);
  }
  target[path[0]] = value;
};

const lookUp = (arr, info, path = []) => {
  arr.forEach((subel, index) => {
    if (Array.isArray(subel)) {
      if (path.length >= 3 && !info.target) {
        info.target = [...path, index];
      } else {
        lookUp(subel, info, [...path, index]);
      }
    } else {
      if (subel > 9 && !info.split) {
        info.split = [...path, index];
      }
      if (!info.target) {
        info.left = [...path, index];
      } else {
        if (!info.right) {
          info.right = [...path, index];
        }
      }
    }
  });
};

const reduceStep = (arr) => {
  const info = {
    target: null,
    left: null,
    right: null,
    split: null,
  };

  lookUp(arr, info);

  if (info.target) {
    const beforeVal = getByPath(arr, info.target);
    if (info.left !== null) {
      const beforeLeft = getByPath(arr, info.left);
      assignByPath(arr, info.left, beforeLeft + beforeVal[0]);
    }
    if (info.right !== null) {
      const beforeRight = getByPath(arr, info.right);
      assignByPath(arr, info.right, beforeRight + beforeVal[1]);
    }
    assignByPath(arr, info.target, 0);
    return true;
  }

  if (info.split) {
    const beforeVal = getByPath(arr, info.split);

    const newVal = [Math.floor(beforeVal / 2), Math.ceil(beforeVal / 2)];
    assignByPath(arr, info.split, newVal);
    return true;
  }

  return false;
};

const fullReduce = (arr) => {
  let needMore = true;
  while (needMore) {
    needMore = reduceStep(arr);
  }
  return arr;
};

const solveOne = (list) => {
  return list.reduce((a, b) => {
    const res = add(a, b);

    fullReduce(res);
    return res;
  });
};

const solution = solveOne(data);

console.log(JSON.stringify(solution));

const magnitude = (item) => {
  if (!Array.isArray(item)) {
    return item;
  } else {
    while (item.length > 2) {
      item = item.map((el) => magnitude(el));
    }
    if (item.length === 1) {
      return magnitude(item[0]);
    }
    return magnitude(item[0]) * 3 + magnitude(item[1]) * 2;
  }
};

console.log('puzzle1', magnitude(solution));

const puzzle2 = () => {
  const data = dataCopy;
  let max = 0;

  for (let a = 0; a < data.length; a++) {
    for (let b = 0; b < data.length; b++) {
      if (b === a) continue;

      const aVal = lodash.cloneDeep(data[a]);
      const bVal = lodash.cloneDeep(data[b]);

      const solution = solveOne([aVal, bVal]);
      const currentMan = magnitude(solution);
      if (currentMan > max) {
        max = currentMan;
      }
    }
  }
  return max;
};

console.log('puzzle2', puzzle2());
