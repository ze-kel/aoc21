const fs = require('fs');

const file = fs.readFileSync('./input.txt');

const data = file
  .toString()
  .split('\n')
  .map((el) => {
    if (!el.length) return;
    const split = el.split(' ');
    return { dir: split[0], val: Number(split[1]) };
  });

const commandMap = {
  forward: ['x', 1],
  up: ['y', -1],
  down: ['y', 1],
};

const puzzle1 = data.reduce(
  (current, command) => {
    if (!command) return current;
    const cm = commandMap[command.dir];
    current[cm[0]] += command.val * cm[1];
    return current;
  },
  { x: 0, y: 0 }
);

console.log('puzzle1', puzzle1.x * puzzle1.y);

const puzzle2 = data.reduce(
  (current, command) => {
    if (!command) return current;

    switch (command.dir) {
      case 'down': {
        current.aim += command.val;
        return current;
      }
      case 'up': {
        current.aim -= command.val;
        return current;
      }
      case 'forward': {
        current.x += command.val;
        current.y += current.aim * command.val;
        return current;
      }
    }
    return current;
  },
  { x: 0, y: 0, aim: 0 }
);

console.log('puzzle2', puzzle2.x * puzzle2.y);
