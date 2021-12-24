const fs = require('fs');

const file = fs.readFileSync('./inputMod.txt');
const fileOrig = fs.readFileSync('./input.txt');

const lodash = require('../lodash');

const data = file
  .toString()
  .split('\n\n')
  .map((block) => {
    return block.split('\n').map((str) => str.split(' '));
  });

const dataSingle = fileOrig
  .toString()
  .split('\n')
  .map((str) => str.split(' '));

const numOrValue = (nums, something) => {
  const number = Number(something);
  if (isNaN(number)) {
    return nums[something];
  }
  return number;
};

const operate = (nums, instruction, input, inputCounter) => {
  switch (instruction[0]) {
    case 'inp':
      nums[instruction[1]] = Number(input[inputCounter.counter]);
      inputCounter.counter = inputCounter.counter + 1;
      break;
    case 'add':
      nums[instruction[1]] += numOrValue(nums, instruction[2]);
      break;
    case 'mul':
      nums[instruction[1]] = numOrValue(nums, instruction[1]) * numOrValue(nums, instruction[2]);
      break;
    case 'div':
      nums[instruction[1]] = Math.floor(numOrValue(nums, instruction[1]) / numOrValue(nums, instruction[2]));
      break;
    case 'mod':
      nums[instruction[1]] = numOrValue(nums, instruction[1]) % numOrValue(nums, instruction[2]);
      break;
    case 'eql':
      nums[instruction[1]] = Number(numOrValue(nums, instruction[1]) === numOrValue(nums, instruction[2]));
      break;
  }
};

const fullInstr = (data, input, nums) => {
  const counter = { counter: 0 };
  data.forEach((instr) => {
    operate(nums, instr, input, counter);
  });
  return nums;
};

let possibleVals = [];

const bruteBack = () => {
  let targets = {
    0: true,
  };
  for (inn = data.length - 1; inn >= 0; inn--) {
    console.log('LEFT', inn);
    let nextTargets = {};
    const instructions = data[inn];

    for (i = 0; i < 10; i++) {
      for (z = 0; z < 500000; z++) {
        const res = fullInstr(instructions, String(i), { x: 0, y: 0, z, w: 0 });
        if (targets[res.z]) {
          nextTargets[z] = true;
        }
      }
    }
    if (!Object.keys(nextTargets).length) {
      return;
    }
    possibleVals[inn] = targets;
    targets = nextTargets;
  }
};

let cachedData;

try {
  cachedData = fs.readFileSync('./cache.json').toString();
} catch {}

if (cachedData) {
  possibleVals = JSON.parse(cachedData);
} else {
  bruteBack();
  fs.writeFileSync('./cache.json', JSON.stringify(possibleVals));
}

const bruteForward = (instruction, input, baseZ, direction) => {
  if (instruction === data.length) {
    return input;
  }
  const allowed = possibleVals[instruction];

  for (let i = direction > 0 ? 1 : 9; i >= 1 && i < 10; i += direction) {
    if (instruction === 0 && i === 0) {
      continue;
    }
    const solveResult = fullInstr(data[instruction], String(i), { x: 0, y: 0, z: baseZ, w: 0 });

    if (allowed[solveResult.z]) {
      const furtherSolve = bruteForward(instruction + 1, input + String(i), solveResult.z, direction);
      if (furtherSolve) {
        return furtherSolve;
      }
    }
  }

  return false;
};

const maximized = bruteForward(0, '', 0, -1);
const verifyOne = fullInstr(dataSingle, maximized, { x: 0, y: 0, z: 0, w: 0 });

console.log('puzzle1', maximized);
console.log('verifyOne', verifyOne);

const minimized = bruteForward(0, '', 0, 1);
const verifyTwo = fullInstr(dataSingle, minimized, { x: 0, y: 0, z: 0, w: 0 });

console.log('verifyTwo', verifyTwo);
console.log('puzzle1', minimized);
