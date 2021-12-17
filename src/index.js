const readline = require('readline');

'use strict';

class TicTacToe {
  constructor() {
    this.moveState = new Array(9).fill(null);
    this.display = '';
    this.currentPlayer = 1;
    this.glyph = 'X';
    this.cellKey = {
      1: 6,
      2: 7,
      3: 8,
      4: 3,
      5: 4,
      6: 5,
      7: 0,
      8: 1,
      9: 2
    }

    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  cellManager(number, moveState) {
    return !moveState ? number : moveState;
  }

  updateDisplay() {
    this.display =
    `    ${this.cellManager(7, this.moveState[0])} | ${this.cellManager(8, this.moveState[1])} | ${this.cellManager(9, this.moveState[2])}
    ---------
    ${this.cellManager(4, this.moveState[3])} | ${this.cellManager(5, this.moveState[4])} | ${this.cellManager(6, this.moveState[5])}
    ---------
    ${this.cellManager(1, this.moveState[6])} | ${this.cellManager(2, this.moveState[7])} | ${this.cellManager(3, this.moveState[8])}\n`
  }

  pushDisplay() {
    this.updateDisplay();
    console.clear();
    console.log(this.display, '\n', `Player ${this.currentPlayer}, please select a cell.`);
  }

  start() {
    this.pushDisplay();
    this.rl.on('line', input => {
      if (!input.match(/^[0-9]+$/) || parseInt(input) > 9 || parseInt(input) < 1) {
        this.pushDisplay();
        console.log('Not a valid cell.');
      } else if (this.moveState[this.cellKey[input]]) {
        this.pushDisplay();
        console.log('This cell is occupied.')
      } else {
        this.takeTurn(input);
      }
    });
  }

  takeTurn(input) {
    this.moveState[this.cellKey[input]] = this.glyph;
    this.checkWin(this.currentPlayer, this.glyph);
    this.currentPlayer === 1 ? this.currentPlayer = 2 : this.currentPlayer = 1;
    this.glyph === 'X' ? this.glyph = 'O' : this.glyph = "X";
    this.pushDisplay();
  }

  checkWin(player, glyph) {
    const [ a1, a2, a3, b1, b2, b3, c1, c2, c3 ] = this.moveState;
    const row1 = [a1, a2, a3],
          row2 = [b1, b2, b3],
          row3 = [c1, c2, c3],
          col1 = [a1, b1, c1],
          col2 = [a2, b2, c2],
          col3 = [a3, b3, c3],
          diagNeg = [a1, b2, c3],
          diagPos = [c1, b2, a3];
    const winConditions = [row1, row2, row3, col1, col2, col3, diagNeg, diagPos];

    const win = winConditions.some(condition => {
      return condition.every(cell => {
        return cell === glyph;
      })
    })

    if(win) {
      this.updateDisplay()
      this.rl.close();
      console.log(`${this.display}`, '\n', `Player ${player} wins.`);
      process.exit();
    }
  }
}

const game = new TicTacToe();
game.start();