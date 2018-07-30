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

const gameLoop = () => {
  //check for a winning player
  const winningPlayer = bs.hasWinner(state);
  if (winningPlayer) {
    console.log(`Player ${winningPlayer} Wins!`);
  }

  return gameLoop();
};

gameLoop();
