//Battleshipt game logic
const bs = require("./battleshipt");

//Use the built-in readline module to get player input
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

//Prompt the player with a question and return the answer
const prompt = q => {
  return new Promise(resolve => {
    rl.question(q + "\n> ", answer => {
      resolve(answer.toUpperCase());
    });
  });
};

//Style the winning message
const winningMsg = msg => console.log("\x1b[1m\x1b[32m\x1b[4m%s\x1b[0m\n", msg);

//Style the success message
const successMsg = msg => console.log("\x1b[32m%s\x1b[0m\n", msg);

//Style the error message
const errorMsg = msg => console.log("\x1b[31m%s\x1b[0m\n", msg);

//Clear the terminal
const clearTerminal = () => console.log("\033c");

//Return a multiline string representing the ships array as a grid
const shipsGrid = array =>
  array.reduce((str, row, rowIndex) => {
    //add the column numbers along the top
    if (rowIndex === 0) {
      str += "  0 1 2 3 4";
    }
    //append the row to the string
    str += row.reduce((rowStr, col, colIndex) => {
      //add the row letter to the beginning of the string
      if (colIndex === 0) {
        rowStr += `\n${bs.letters[rowIndex]}`;
      }
      //set the position value based on if a ship is placed or not
      const value = col === 1 ? "♦" : "◦";
      //append to string
      return rowStr + ` ${value}`;
    }, "");
    return str;
  }, "") + "\n\n"; //add two new lines for spacing

//Return a multiline string representing the hits array as a grid
const hitsGrid = array =>
  array.reduce((str, row, rowIndex) => {
    //add the column numbers along the top
    if (rowIndex === 0) {
      str += "  0 1 2 3 4";
    }
    //append the row to the string
    str += row.reduce((rowStr, col, colIndex) => {
      //add the row letter to the beginning of the string
      if (colIndex === 0) {
        rowStr += `\n${bs.letters[rowIndex]}`;
      }
      //set the position value based on if a ship is placed, a hit, or a miss
      let value = "◦"; //not placed
      if (col === 1) {
        value = "\x1b[31mX\x1b[0m"; //is a hit
      }
      if (col === 0) {
        value = "•"; //is a miss
      }
      //append to string
      return rowStr + ` ${value}`;
    }, "");
    return str;
  }, "") + "\n\n"; //add two new lines for spacing

//Return the ships array of the requested player
const playerShips = playerNum => state[bs.playerString(playerNum)].ships;

//Return the hits array of the requested player
const playerHits = playerNum => state[bs.playerString(playerNum)].hits;

//Ask the user if they want to play multiplayer or the computer.
const promptMultiplayer = async () => {
  //don't run if multiplayer has already been set
  if (state.multiPlayer === null) {
    const answer = await prompt(
      "Game Mode: Multiplayer or play against Computer? (M/C)"
    );
    //verify that their answer is an option
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
    const position = bs.naturalizePosition(
      await prompt(
        shipsGrid(playerShips(state.currentPlayer)) +
          `Player ${
            state.currentPlayer
          }: Where would you like to place your ship #${shipCount + 1}?`
      )
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
      const shipsLeft =
        bs.numberOfShips - bs.countHits(state, state.currentPlayer);
      successMsg(
        `Computer hit a ship at ${position}! ${shipsLeft} ${
          shipsLeft === 1 ? "ship" : "ships"
        } left.`
      );
    } else {
      state = bs.placeMiss(state, state.currentPlayer, position);
      successMsg(`Computer missed.`);
    }
    state = bs.togglePlayer(state);
    return gameLoop();
  }

  //prompt current player to place a hit
  const position = bs.naturalizePosition(
    await prompt(
      hitsGrid(playerHits(state.currentPlayer)) +
        `Player ${state.currentPlayer}: Where would you like to attack?`
    )
  );
  ////check if hit is valid
  if (bs.validPosition(position)) {
    if (bs.canPlaceHit(state, state.currentPlayer, position)) {
      /////if true place hit, toggle player, rerun game loop
      if (bs.didHitShip(state, bs.otherPlayer(state.currentPlayer), position)) {
        state = bs.placeHit(state, state.currentPlayer, position);
        clearTerminal();
        const shipsLeft =
          bs.numberOfShips - bs.countHits(state, state.currentPlayer);
        successMsg(
          `Player ${
            state.currentPlayer
          } hit a ship at ${position}! ${shipsLeft} ${
            shipsLeft === 1 ? "ship" : "ships"
          } left.`
        );
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
