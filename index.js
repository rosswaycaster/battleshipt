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
      //set multiplayer state
      state = bs.multiplayerState(state, answer);
      clearTerminal();
    } else {
      clearTerminal();
      //display error if invalid answer
      errorMsg("Please input 'M' for Multiplayer or 'C' for Computer.");
    }
    return gameLoop();
  }
};

//Check for a winning player
const checkForWinner = () => {
  const winningPlayer = bs.hasWinner(state);
  if (winningPlayer) {
    //output winning hits grid
    console.log(hitsGrid(playerHits(winningPlayer)));
    //check to see if computer won
    if (state.multiPlayer === false && winningPlayer === 2) {
      winningMsg(`Computer Wins!`);
      process.exit();
    } else {
      winningMsg(`Player ${winningPlayer} Wins!`);
      process.exit();
    }
  }
};

//Prompt players to place their ships
const placeShips = async () => {
  //get the number of ships placed for the current player
  const shipCount = bs.countShips(state, state.currentPlayer);

  //only prompt if user hasn't placed all their ships
  if (shipCount < bs.numberOfShips) {
    //check if computer is playing as player 2
    if (state.multiPlayer === false && state.currentPlayer === 2) {
      //generate a random position that can be placed on grid
      const position = bs.randomShipPosition(state, 2);
      //place the ship
      state = bs.placeShip(state, 2, position);
      //toggle the player
      state = bs.togglePlayer(state);
      return gameLoop();
    }

    //prompt to place ship below ship grid
    const position = bs.naturalizePosition(
      await prompt(
        `Player ${state.currentPlayer} Ships\n\n` +
          shipsGrid(playerShips(state.currentPlayer)) +
          `Player ${
            state.currentPlayer
          }: Where would you like to place your ship #${shipCount + 1}?`
      )
    );
    //check if requested position is valid
    if (bs.validPosition(position)) {
      //check if a ship has already been placed at this position
      if (bs.canPlaceShip(state, state.currentPlayer, position)) {
        //place the ship
        state = bs.placeShip(state, state.currentPlayer, position);
        //toggle the player
        state = bs.togglePlayer(state);
        clearTerminal();
        return gameLoop();
      } else {
        clearTerminal();
        //display error if a ship has already been placed at this position
        errorMsg(`You've already placed a ship at ${position}. Try again.`);
        return gameLoop();
      }
    } else {
      clearTerminal();
      //display error if the requested position is invalid
      errorMsg(`${position} is an invalid position. Try again.`);
      return gameLoop();
    }
  }
};

//Prompt players to place their attacks (hit/miss)
const placeAttacks = async () => {
  //check if computer is playing as player 2
  if (state.multiPlayer === false && state.currentPlayer === 2) {
    //generate a random position that can be placed on grid
    const position = bs.randomHitPosition(state, 2);
    //check to see if the position was a hit or miss
    if (bs.didHitShip(state, bs.otherPlayer(state.currentPlayer), position)) {
      //place the hit
      state = bs.placeHit(state, state.currentPlayer, position);
      //calculate how many ships the other player has left
      const shipsLeft =
        bs.numberOfShips - bs.countHits(state, state.currentPlayer);
      //display that it was a hit and how many ships are left
      successMsg(
        `Computer hit a ship at ${position}! ${shipsLeft} ${
          shipsLeft === 1 ? "ship" : "ships"
        } left to sink.`
      );
    } else {
      //place the miss
      state = bs.placeMiss(state, state.currentPlayer, position);
      //calculate how many ships the other player has left
      const shipsLeft =
        bs.numberOfShips - bs.countHits(state, state.currentPlayer);
      //display that the computer missed
      successMsg(
        `Computer missed. ${shipsLeft} ${
          shipsLeft === 1 ? "ship" : "ships"
        } left to sink.`
      );
    }
    //toggle the player
    state = bs.togglePlayer(state);
    return gameLoop();
  }

  //prompt to attack and show their previous hits on the grid
  const position = bs.naturalizePosition(
    await prompt(
      `Player ${state.currentPlayer} Attacks\n\n` +
        hitsGrid(playerHits(state.currentPlayer)) +
        `Player ${state.currentPlayer}: Where would you like to attack?`
    )
  );
  //check if requested position is valid
  if (bs.validPosition(position)) {
    //check if a hit/miss has already been placed at this position
    if (bs.canPlaceHit(state, state.currentPlayer, position)) {
      //check to see if the position was a hit or miss
      if (bs.didHitShip(state, bs.otherPlayer(state.currentPlayer), position)) {
        //place the hit
        state = bs.placeHit(state, state.currentPlayer, position);
        clearTerminal();
        //calculate how many ships the other player has left
        const shipsLeft =
          bs.numberOfShips - bs.countHits(state, state.currentPlayer);
        //display that the attack was a hit and how many ships are left
        successMsg(
          `Player ${
            state.currentPlayer
          } hit a ship at ${position}! ${shipsLeft} ${
            shipsLeft === 1 ? "ship" : "ships"
          } left to sink.`
        );
      } else {
        //place the miss
        state = bs.placeMiss(state, state.currentPlayer, position);
        clearTerminal();
        //calculate how many ships the other player has left
        const shipsLeft =
          bs.numberOfShips - bs.countHits(state, state.currentPlayer);
        //display that the attack was a miss
        successMsg(
          `Player ${state.currentPlayer} missed. ${shipsLeft} ${
            shipsLeft === 1 ? "ship" : "ships"
          } left to sink.`
        );
      }
      //toggle the player
      state = bs.togglePlayer(state);
      return gameLoop();
    } else {
      clearTerminal();
      //display error if an attack has already been placed at this position
      errorMsg(`You've already attacked ${position}. Try again.`);
      return gameLoop();
    }
  } else {
    clearTerminal();
    //display error if the requested position is invalid
    errorMsg(`${position} is an invalid position. Try again.`);
    return gameLoop();
  }
};

//Set the initial game state
let state = bs.initialState();

//Game loop that calls the game functions
const gameLoop = () => {
  promptMultiplayer();
  checkForWinner();
  placeShips();
  placeAttacks();
};

//Clear the terminal and start the game
clearTerminal();
gameLoop();
