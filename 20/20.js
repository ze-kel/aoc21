const fs = require('fs');

const file = fs.readFileSync('./input.txt');

const lodash = require('../lodash');

const data = file
  .toString()
  .split('\n')
  .filter((str) => str);

const binaryLine = data[0];

const imageArray = data.slice(1).map((line) => line.split(''));

const image = {};

imageArray.forEach((line, lineIndex) => {
  line.forEach((pixel, horIndex) => {
    image[`${horIndex},${lineIndex}`] = pixel;
  });
});

const bounds = {
  xf: 0,
  xt: imageArray[0].length,
  yf: 0,
  yt: imageArray.length,
};

let enhancementIteration = 0;

const getByCoord = (x, y, image) => {
  if (!image[`${x},${y}`]) {
    return enhancementIteration % 2 === 0 ? '#' : '.';
    //return '.';
  }
  return image[`${x},${y}`];
};

const getEnhancedPixel = (x, y, image) => {
  const pixels = [
    [x - 1, y - 1],
    [x, y - 1],
    [x + 1, y - 1],
    [x - 1, y],
    [x, y],
    [x + 1, y],
    [x - 1, y + 1],
    [x, y + 1],
    [x + 1, y + 1],
  ];

  const mapped = pixels.map((pair) => getByCoord(pair[0], pair[1], image)).map((pixel) => (pixel === '.' ? 0 : 1));

  const targetIndex = parseInt(mapped.join(''), 2);

  return binaryLine[targetIndex];
};

const enhanceIteration = (image) => {
  bounds.xf -= 2;
  bounds.xt += 2;
  bounds.yf -= 2;
  bounds.yt += 2;
  enhancementIteration++;

  const newImage = { ...image };

  for (let x = bounds.xf; x < bounds.xt; x++) {
    for (let y = bounds.yf; y < bounds.yt; y++) {
      newImage[`${x},${y}`] = getEnhancedPixel(x, y, image);
    }
  }
  return newImage;
};

const viz = (image) => {
  for (let y = bounds.yf; y < bounds.yt; y++) {
    const line = [];
    for (let x = bounds.xf; x < bounds.xt; x++) {
      line.push(getByCoord(x, y, image));
    }
    console.log(line.join(''));
  }
};

const doNPasses = (n, image) => {
  for (i = 0; i < n; i++) {
    image = enhanceIteration(image);
  }
  return image;
};

const countHashTags = (image) => {
  let count = 0;
  Object.values(image).forEach((el) => {
    if (el === '#') {
      count++;
    }
  });
  return count;
};

const puzzle1 = (image) => {
  let output = doNPasses(2, image);

  return countHashTags(output);
};

const puzzle2 = (image) => {
  let output = doNPasses(50, image);

  return countHashTags(output);
};

console.log('puzzle1', puzzle1(image));

console.log('puzzle2', puzzle2(image));
