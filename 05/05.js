const fs = require('fs');

const file = fs.readFileSync('./input.txt');

const data = file
  .toString()
  .split('\n')
  .filter((line) => Boolean(line))
  .map((line) => {
    const split = line.split(' -> ').map((subline) => subline.split(','));
    return {
      x: { from: Number(split[0][0]), to: Number(split[1][0]) },
      y: { from: Number(split[0][1]), to: Number(split[1][1]) },
    };
  });

const vizLine = (line) => {
  console.log(line.map((el) => (el > 0 ? el : '.')).join(''));
};

const viz = (field) => {
  field.forEach(vizLine);
};

const ensureAndMark = (field, x, y, maxLine) => {
  if (!field[y]) {
    if (maxLine) {
      field[y] = new Array(maxLine).fill(0);
    } else {
      field[y] = [];
    }
  }
  if (!field[y][x]) {
    field[y][x] = 0;
  }
  field[y][x] += 1;
};

const getRangeUp = (v1, v2) => {
  return v1 > v2 ? [v2, v1] : [v1, v2];
};

const generateFieldHorOnly = (data, maxLine) => {
  const field = [];

  data.forEach((line) => {
    let operateOn = null;
    let static = null;

    if (line.x.from === line.x.to) {
      operateOn = 'y';
      static = line.x.from;
    }
    if (line.y.from === line.y.to) {
      operateOn = 'x';
      static = line.y.from;
    }

    if (!operateOn) return;

    const range = getRangeUp(line[operateOn].from, line[operateOn].to);

    for (let i = range[0]; i <= range[1]; i++) {
      const x = operateOn === 'x' ? i : static;
      const y = operateOn === 'y' ? i : static;

      ensureAndMark(field, x, y, maxLine);
    }
  });
  return field;
};

const overlapReduce = (acc, line) => {
  line.forEach((num) => {
    if (num > 1) {
      acc += 1;
    }
  });
  return acc;
};

const puzzle1 = generateFieldHorOnly(data);
console.log('puzzle 1', puzzle1.reduce(overlapReduce, 0));

const getDir = (x, y) => {
  if (x === y) return 0;
  return x < y ? 1 : -1;
};

const generateFieldFull = (data, maxLine) => {
  const field = [];

  data.forEach((line) => {
    const xDir = getDir(line.x.from, line.x.to);
    const yDir = getDir(line.y.from, line.y.to);

    for (x = line.x.from, y = line.y.from, cont = true; cont; x += xDir, y += yDir) {
      ensureAndMark(field, x, y, maxLine);
      if (x === line.x.to && xDir !== 0) {
        cont = false;
      }
      if (y === line.y.to && yDir !== 0) {
        cont = false;
      }
    }
  });
  return field;
};

const puzzle2 = generateFieldFull(data);
console.log('puzzle 2', puzzle2.reduce(overlapReduce, 0));
