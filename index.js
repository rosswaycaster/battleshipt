const bs = require("./battleshipt");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const prompt = q => {
  return new Promise(resolve => {
    rl.question(q + "\n> ", answer => {
      resolve(answer.toUpperCase());
    });
  });
};

const winningMsg = msg =>
  console.log("\x1b[1m\x1b[32m\x1b[4m %s \x1b[0m\n", msg);

const successMsg = msg => console.log("\x1b[32m%s\x1b[0m\n", msg);

const errorMsg = msg => console.log("\x1b[31m%s\x1b[0m\n", msg);

const clearTerminal = () => console.log("\033c");

const shipsGrid = array =>
  array.reduce((str, row, rowIndex) => {
    if (rowIndex === 0) {
      str += "  0 1 2 3 4";
    }
    str += row.reduce((rowStr, col, colIndex) => {
      if (colIndex === 0) {
        rowStr += `\n${bs.letters[rowIndex]}`;
      }
      const value = col === 1 ? "♦" : "◦";
      return rowStr + ` ${value}`;
    }, "");
    return str;
  }, "") + "\n\n";

const hitsGrid = array =>
  array.reduce((str, row, rowIndex) => {
    if (rowIndex === 0) {
      str += "  0 1 2 3 4";
    }
    str += row.reduce((rowStr, col, colIndex) => {
      if (colIndex === 0) {
        rowStr += `\n${bs.letters[rowIndex]}`;
      }
      let value = "◦";
      if (col === 1) {
        value = "\x1b[31mX\x1b[0m";
      }
      if (col === 0) {
        value = "•";
      }
      return rowStr + ` ${value}`;
    }, "");
    return str;
  }, "") + "\n\n";

const playerShips = playerNum => state[bs.playerString(playerNum)].ships;

const playerHits = playerNum => state[bs.playerString(playerNum)].hits;

const promptMultiplayer = async () => {
  if (state.multiPlayer === null) {
    const answer = await prompt(
      "Game Mode: Multiplayer or play against Computer? (M/C)"
    );
    if (bs.verifyMultiplayerAnswer(answer)) {
      state = bs.multiplayerState(state, answer);
      clearTerminal();
    } else {
      clearTerminal();
      errorMsg("Please input 'M' for Multiplayer or 'C' for Computer.");
    }
    return gameLoop();
  }
};

const checkForWinner = () => {
  //check for a winning player
  const winningPlayer = bs.hasWinner(state);
  if (winningPlayer) {
    console.log(hitsGrid(playerHits(winningPlayer)));
    if (state.multiPlayer === false && winningPlayer === 2) {
      winningMsg(`Computer Wins!`);
      process.exit();
    } else {
      winningMsg(`Player ${winningPlayer} Wins!`);
      process.exit();
    }
  }
};

const placeShips = async () => {
  const shipCount = bs.countShips(state, state.currentPlayer);

  if (shipCount < bs.numberOfShips) {
    if (state.multiPlayer === false && state.currentPlayer === 2) {
      const position = bs.randomShipPosition(state, 2);
      state = bs.placeShip(state, 2, position);
      state = bs.togglePlayer(state);
      return gameLoop();
    }

    ////if false then prompt to place ship
    const position = await prompt(
      shipsGrid(playerShips(state.currentPlayer)) +
        `Player ${
          state.currentPlayer
        }: Where would you like to place your ship #${shipCount + 1}?`
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
};

const placeHits = async () => {
  if (state.multiPlayer === false && state.currentPlayer === 2) {
    const position = bs.randomHitPosition(state, 2);

    /////if true place hit, toggle player, rerun game loop
    if (bs.didHitShip(state, bs.otherPlayer(state.currentPlayer), position)) {
      state = bs.placeHit(state, state.currentPlayer, position);
      successMsg(`Computer hit a ship at ${position}!`);
    } else {
      state = bs.placeMiss(state, state.currentPlayer, position);
      successMsg(`Computer missed.`);
    }
    state = bs.togglePlayer(state);
    return gameLoop();
  }

  //prompt current player to place a hit
  const position = await prompt(
    hitsGrid(playerHits(state.currentPlayer)) +
      `Player ${state.currentPlayer}: Where would you like to attack?`
  );
  ////check if hit is valid
  if (bs.validPosition(position)) {
    if (bs.canPlaceHit(state, state.currentPlayer, position)) {
      /////if true place hit, toggle player, rerun game loop
      if (bs.didHitShip(state, bs.otherPlayer(state.currentPlayer), position)) {
        state = bs.placeHit(state, state.currentPlayer, position);
        clearTerminal();
        successMsg(`Player ${state.currentPlayer} hit a ship at ${position}!`);
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

let state = bs.initialState();

const gameLoop = async () => {
  promptMultiplayer();

  checkForWinner();

  placeShips();

  placeHits();
};

clearTerminal();
gameLoop();
