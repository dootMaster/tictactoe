const readline = require('readline');
const colors = require('colors');

'use strict';

class TicTacToe {
  constructor() {
    // this.moveState = new Array(9).fill(null);
    this.moveState = [new Array(3).fill(null), new Array(3).fill(null), new Array(3).fill(null)];
    this.display = '';
    this.currentPlayer = 1;
    this.glyph = 'X'.red;
    this.playerAmount = null;
    this.availableCPUMoves = Array.from(Array(9).keys());

    this.cellKey = {
      1: [2, 0],
      2: [2, 1],
      3: [2, 2],
      4: [1, 0],
      5: [1, 1],
      6: [1, 2],
      7: [0, 0],
      8: [0, 1],
      9: [0, 2],
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
    `    ${this.cellManager(7, this.moveState[0][0])} | ${this.cellManager(8, this.moveState[0][1])} | ${this.cellManager(9, this.moveState[0][2])}
    ---------
    ${this.cellManager(4, this.moveState[1][0])} | ${this.cellManager(5, this.moveState[1][1])} | ${this.cellManager(6, this.moveState[1][2])}
    ---------
    ${this.cellManager(1, this.moveState[2][0])} | ${this.cellManager(2, this.moveState[2][1])} | ${this.cellManager(3, this.moveState[2][2])}\n`
  }

  pushDisplay() {
    this.updateDisplay();
    // console.clear();
    console.log(this.display, '\n', `Player ${this.currentPlayer}, please select a cell.`);
  }

  chooseGameMode() {
    this.rl.question('How many players? (1 or 2)', input => {
      if(![1, 2].some(num => parseInt(input) === num)) {
        console.log('Please enter 1 or 2.');
      } else if(input === '2') {
        this.playerAmount = 2;
        this.startGame();
      } else {
        this.playerAmount = 1;
        this.startGame();
      }
    })
  }

  startGame() {
    this.pushDisplay();
    this.rl.on('line', input => {
      const [y, x] = this.cellKey[input];
      if (![1,2,3,4,5,6,7,8,9].some(num => parseInt(input) === num)) {
        this.pushDisplay();
        console.log('Not a valid cell.');
      } else if (this.moveState[y][x]) {
        this.pushDisplay();
        console.log('This cell is occupied.')
      } else {
        if(this.playerAmount === 2) {
          this.twoPlayerTurnHandler(input);
        } else {
          this.singlerPlayerHandler(input);
        }
      }
    });
  }

  singlerPlayerHandler(input) {
    const [y, x] = this.cellKey[input];
    this.moveState[y][x] = this.glyph;
    this.availableCPUMoves.splice(this.availableCPUMoves.indexOf(parseInt(input) - 1), 1);
    this.pushDisplay();
    this.checkWin(this.currentPlayer, this.glyph);
    this.switchPlayer();
    this.CPUturnHandler();
  }

  CPUturnHandler() {
    const randomMove = this.availableCPUMoves[Math.floor(Math.random() * this.availableCPUMoves.length)];
    this.availableCPUMoves.splice(this.availableCPUMoves.indexOf(randomMove), 1);
    const [y, x] = this.cellKey[randomMove + 1];
    this.moveState[y][x] = this.glyph;
    this.checkWin(this.currentPlayer, this.glyph);
    this.switchPlayer();
    this.pushDisplay();
  }

  twoPlayerTurnHandler(input) {
    const [y, x] = this.cellKey[input];
    this.moveState[y][x] = this.glyph;
    this.checkWin(this.currentPlayer, this.glyph);
    this.switchPlayer();
    this.pushDisplay();
  }

  switchPlayer() {
    this.currentPlayer === 1 ? this.currentPlayer = 2 : this.currentPlayer = 1;
    this.glyph === 'X'.red ? this.glyph = 'O'.yellow : this.glyph = "X".red;
  }

  checkWin(player, glyph) {
    const [ [a1, a2, a3], [b1, b2, b3], [c1, c2, c3] ] = this.moveState;
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

    if (win) {
      this.updateDisplay()
      this.rl.close();
      this.pushDisplay();
      console.log(`Player ${player} wins.`);
      process.exit();
    } else if (this.moveState.every(row => row.every(item => !!item))) {
      this.updateDisplay()
      this.rl.close();
      this.pushDisplay();
      console.log(`Not a tie. Both are losers.`);
      process.exit();
    }
  }
}

const game = new TicTacToe();
game.chooseGameMode();