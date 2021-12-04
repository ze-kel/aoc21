const fs = require('fs');

const lodash = require('../lodash');

const file = fs.readFileSync('./input.txt');

const data = file.toString().split('\n\n');

const chosen = data[0].split(',').map((el) => Number(el));

const properSplit = (string) => {
  const arr = [];
  for (let i = 0; i < string.length; ) {
    const l1 = string[i] ? string[i] : '0';
    const l2 = string[i + 1];
    arr.push(Number(l1 + l2));
    i += 3;
  }
  return arr;
};

const boards = data.slice(1, data.length).map((el) => {
  return el
    .split('\n')
    .map(properSplit)
    .map((row) =>
      row.map((number) => ({
        number,
        marked: false,
      }))
    );
});

const boardsCopy = lodash.cloneDeep(boards);

const winCheck = (board) => {
  const lineReduce = (acc, el) => {
    if (!el.marked) {
      acc = false;
    }
    return acc;
  };

  for (let h = 0; h < board.length; h++) {
    if (board[h].reduce(lineReduce, true)) {
      return true;
    }
  }

  for (let v = 0; v < board[0].length; v++) {
    const vert = board.reduce((acc, line) => {
      acc.push(line[v]);

      return acc;
    }, []);

    if (vert.reduce(lineReduce, true)) {
      return true;
    }
  }
  return false;
};

const findWinner = (boards) => {
  for (let c = 0; c < chosen.length; c++) {
    boards.forEach((board) => {
      board.forEach((line) => {
        line.forEach((number) => {
          if (number.number === chosen[c]) {
            number.marked = true;
          }
        });
      });
    });

    const winner = boards.find((board) => winCheck(board));

    if (winner) {
      return { board: winner, number: chosen[c] };
    }
  }
};

const calculateScore = (winner) => {
  const unmarkedSum = winner.board.reduce((acc, line) => {
    line.forEach((num) => {
      if (!num.marked) {
        return (acc += num.number);
      }
    });

    return acc;
  }, 0);

  return unmarkedSum * winner.number;
};

const p1Winner = findWinner(boards);

console.log('puzzle1', calculateScore(p1Winner));

const findLastWinner = (boards) => {
  let lastWinner = null;

  for (let c = 0; c < chosen.length; c++) {
    if (boards.length === 0) {
      return lastWinner;
    }

    boards.forEach((board) => {
      board.forEach((line) => {
        line.forEach((number) => {
          if (number.number === chosen[c]) {
            number.marked = true;
          }
        });
      });
    });

    const winner = boards.find((board) => winCheck(board));

    if (winner) {
      lastWinner = { board: winner, number: chosen[c] };

      boards = boards.filter((board) => !winCheck(board));
    }
  }

  return lastWinner;
};

const lastWinner = findLastWinner(boardsCopy);

console.log('puzzle2', calculateScore(lastWinner));
