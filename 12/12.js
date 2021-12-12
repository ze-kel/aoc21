const fs = require('fs');

const file = fs.readFileSync('./input.txt');

const lodash = require('../lodash');

const data = file
  .toString()
  .split('\n')
  .filter((str) => str)
  .map((line) => line.split('-'));

const buildGraph = (data) => {
  const nodes = {};

  data.forEach((pair) => {
    if (!nodes[pair[0]]) {
      nodes[pair[0]] = {
        name: pair[0],
        connetcted: [],
      };
    }
    if (!nodes[pair[1]]) {
      nodes[pair[1]] = {
        name: pair[1],
        connetcted: [],
      };
    }

    nodes[pair[0]].connetcted.push(pair[1]);
    nodes[pair[1]].connetcted.push(pair[0]);
  });

  return nodes;
};

const isBig = (nodeName) => {
  if (nodeName === 'start' || nodeName === 'end') {
    return true;
  }
  return nodeName[0] == nodeName[0].toUpperCase();
};

const checkBeenTwice = (arr) => {
  arr = arr.filter((el) => !isBig(el));

  return new Set(arr).size !== arr.length;
};

const findPath = (nodes, startNode, pathBefore, smallAllowed) => {
  const path = [...pathBefore];

  path.push(startNode.name);

  if (startNode.name === 'end') {
    return [path];
  }

  const beenTwice = checkBeenTwice(path);

  const canGoTo = startNode.connetcted.filter((node) => {
    if (node === 'start') return false;

    if (!isBig(node)) {
      if (smallAllowed === 1 || beenTwice) {
        return !path.includes(node);
      } else {
        const before = path.filter((el) => el === node);
        return before.length < smallAllowed;
      }
    }

    return true;
  });

  let possiblePaths = [];

  canGoTo.forEach((direction) => {
    possiblePaths = possiblePaths.concat(findPath(nodes, nodes[direction], path, smallAllowed));
  });

  return possiblePaths;
};

const graph = buildGraph(data);
const start = graph['start'];

console.log('puzzle1', findPath(graph, start, [], 1).length);

console.log('puzzle1', findPath(graph, start, [], 2).length);
