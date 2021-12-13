const fs = require('fs');

const file = fs.readFileSync('./input.txt');

const lodash = require('../lodash');

const data = file.toString().split('\n\n');

const dots = data[0].split('\n').map((el) => el.split(',').map((e) => Number(e)));

const instructions = data[1].split('\n').map((el) => {
  const newEl = el.replace('fold along ', '').split('=');
  return { axis: newEl[0], coord: Number(newEl[1]) };
});

const viz = (page) => {
  page.forEach((line) => {
    console.log(line.map((el) => (el ? '#' : '.')).join(''));
  });
};

const buildPage = (dots) => {
  const page = [];

  const maxX = dots.reduce((acc, dot) => {
    return dot[0] > acc ? dot[0] : acc;
  }, 0);

  dots.forEach((dot) => {
    if (!page[dot[1]]) {
      page[dot[1]] = Array(maxX + 1).fill(false);
    }

    page[dot[1]][dot[0]] = true;
  });

  for (let i = 0; i < page.length; i++) {
    if (page[i] == undefined) {
      page[i] = Array(maxX + 1).fill(false);
    }
  }

  return page;
};

const mergeArrays = (a, b) => {
  let yMod = 0;
  if (a.length !== b.length) {
    yMod = a.length - b.length;
  }

  for (y = yMod; y < a.length; y++) {
    for (x = 0; x < a[0].length; x++) {
      a[y][x] = a[y][x] || b[y - yMod][x];
    }
  }
  return a;
};

const fold = (page, instruction) => {
  if (instruction.axis === 'x') {
    const left = [];

    const right = [];

    page.forEach((horLine) => {
      const l = horLine.slice(0, instruction.coord);
      const r = horLine.slice(instruction.coord + 1, horLine.length);

      left.push(l);
      right.push(r);
    });

    right.forEach((line) => line.reverse());

    return mergeArrays(left, right);
  } else {
    const top = page.slice(0, instruction.coord);
    const bottom = page.slice(instruction.coord + 1, page.length);

    bottom.reverse();

    return mergeArrays(top, bottom);
  }
};

const runInstructions = (dots, instructions) => {
  let page = buildPage(dots);

  instructions.forEach((inst) => {
    page = fold(page, inst);
  });

  return page;
};

const count = (dots) => {
  let total = 0;

  dots.forEach((line) => {
    line.forEach((point) => {
      if (point === true) {
        total++;
      }
    });
  });

  return total;
};

const oneFold = runInstructions(dots, [instructions[0]]);

console.log('puzzle1', count(oneFold));

const full = runInstructions(dots, instructions);

viz(full);
