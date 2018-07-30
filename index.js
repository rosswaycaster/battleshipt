const bs = require("./battleshipt");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const prompt = q => {
  return new Promise(resolve => {
    rl.question(q + "\n", answer => {
      if (answer) {
        resolve(answer);
      }
    });
  });
};

let state = bs.initialState();

const gameLoop = async () => {
  //check for a winning player
  const winningPlayer = bs.hasWinner(state);
  if (winningPlayer) {
    console.log(`Player ${winningPlayer} Wins!`);
  }

  //see if current player has placed all ships
  if (bs.countShips(state, state.currentPlayer) < bs.numberOfShips) {
    ////if false then prompt to place ship
    const position = await prompt(
      `Player ${state.currentPlayer}: Where would you like to place your ship?`
    );
    //////check if ship is valid
    if (bs.canPlaceShip(state, state.currentPlayer, position)) {
      ////////if true place ship, rerun game loop
      state = bs.placeShip(state, state.currentPlayer, position);
      state = bs.togglePlayer(state);
      return gameLoop();
    } else {
      console.log("You've already placed a ship there.");
    }
    ////////if false prompt again
  }

  //prompt current player to place a hit
  const position = await prompt(
    `Player ${state.currentPlayer}: Where would you like to attack?`
  );
  ////check if hit is valid
  if (bs.canPlaceHit(state, state.currentPlayer, position)) {
    /////if true place hit, toggle player, rerun game loop
    if (bs.didHitShip(state, bs.otherPlayer(state.currentPlayer), position)) {
      state = bs.placeHit(state, state.currentPlayer, position);
    } else {
      state = bs.placeMiss(state, state.currentPlayer, position);
    }
    state = bs.togglePlayer(state);
    return gameLoop();
  } else {
    /////if false prompt again
    console.log("You've already attacked here");
    return gameLoop();
  }

  return gameLoop();
};

gameLoop();
