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
  ////if false then prompt to place ship
  //////check if ship is valid
  ////////if false prompt again
  ////////if true place ship, rerun game loop

  //prompt current player to place a hit
  ////check if hit is valid
  /////if false prompt again
  /////if true place hit, toggle player, rerun game loop

  return gameLoop();
};

gameLoop();
