const bs = require("./battleshipt");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const prompt = q => {
  return new Promise(resolve => {
    rl.question(q + "\n> ", answer => {
      if (answer) {
        resolve(answer);
      }
    });
  });
};

const winningMsg = msg =>
  console.log("\x1b[42m\x1b[37m\x1b[1m %s \x1b[0m", msg);

const successMsg = msg => console.log("\x1b[32m%s\x1b[0m", msg);

const errorMsg = msg => console.log("\x1b[31m%s\x1b[0m", msg);

const clearTerminal = () => console.log("\033c");

let state = bs.initialState();

const gameLoop = async () => {
  //check for a winning player
  const winningPlayer = bs.hasWinner(state);
  if (winningPlayer) {
    clearTerminal();
    winningMsg(`Player ${winningPlayer} Wins!`);
    process.exit();
  }

  //see if current player has placed all ships
  if (bs.countShips(state, state.currentPlayer) < bs.numberOfShips) {
    ////if false then prompt to place ship
    const position = await prompt(
      `Player ${state.currentPlayer}: Where would you like to place your ship?`
    );
    //////check if ship is valid
    if (bs.validPosition(position)) {
      if (bs.canPlaceShip(state, state.currentPlayer, position)) {
        ////////if true place ship, rerun game loop
        state = bs.placeShip(state, state.currentPlayer, position);
        state = bs.togglePlayer(state);
        clearTerminal();
        return gameLoop();
      } else {
        clearTerminal();
        errorMsg(`You've already placed a ship at ${position}. Try again.`);
        return gameLoop();
      }
    } else {
      ////////if false prompt again
      clearTerminal();
      errorMsg(`${position} is an invalid position. Try again.`);
      return gameLoop();
    }
  }

  //prompt current player to place a hit
  const position = await prompt(
    `Player ${state.currentPlayer}: Where would you like to attack?`
  );
  ////check if hit is valid
  if (bs.validPosition(position)) {
    if (bs.canPlaceHit(state, state.currentPlayer, position)) {
      /////if true place hit, toggle player, rerun game loop
      if (bs.didHitShip(state, bs.otherPlayer(state.currentPlayer), position)) {
        state = bs.placeHit(state, state.currentPlayer, position);
        clearTerminal();
        successMsg(`Player ${state.currentPlayer} hit a ship!`);
      } else {
        state = bs.placeMiss(state, state.currentPlayer, position);
        clearTerminal();
        successMsg(`Player ${state.currentPlayer} missed.`);
      }
      state = bs.togglePlayer(state);
      return gameLoop();
    } else {
      /////if false prompt again
      clearTerminal();
      errorMsg(`You've already attacked ${position}. Try again.`);
      return gameLoop();
    }
  } else {
    ////////if false prompt again
    clearTerminal();
    errorMsg(`${position} is an invalid position. Try again.`);
    return gameLoop();
  }
};

clearTerminal();
gameLoop();
