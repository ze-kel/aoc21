const fs = require('fs');

const file = fs.readFileSync('./input.txt');

const data = file
  .toString()
  .split('\n')
  .map((el) => Number(el));

const puzzle1 = data.reduce((counter, el, index, array) => {
  if (index < 1) return counter;
  if (array[index - 1] < el) {
    counter += 1;
  }
  return counter;
}, 0);

console.log('puzzle1', puzzle1);

const sumReducer = (prev, cur) => prev + cur;

const puzzle2 = data
  .reduce((arrays, el, index, array) => {
    if (index > array.length - 4) {
      return arrays;
    }
    arrays.push([el, array[index + 1], array[index + 2]]);
    return arrays;
  }, [])
  .reduce((counter, el, index, array) => {
    if (index < 1) return counter;
    if (array[index - 1].reduce(sumReducer) < el.reduce(sumReducer)) {
      counter += 1;
    }
    return counter;
  }, 0);

console.log('puzzle2', puzzle2);
