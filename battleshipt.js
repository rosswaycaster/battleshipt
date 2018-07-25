const initialState = () => ({
  multiPlayer: null,
  currentPlayer: 1,
  player1: {
    ships: createGrid(),
    hits: createGrid()
  },
  player2: {
    ships: createGrid(),
    hits: createGrid()
  }
});

//Return a single merged object
const mergeObjs = (...objs) => Object.assign({}, ...objs);

//Create a 5 by 5 array
const createGrid = () => [...Array(5)].map(() => [...Array(5)]);

const letters = "ABCDE";

//Return the index of the letter
const letterToRow = row => letters.indexOf(row);

//Return an updated state with ship placed
const placeShip = (state, position) => {
  const currentPlayer = `player${state.currentPlayer}`;

  const ships = state[currentPlayer].ships.map((row, rowIndex) => {
    if (rowIndex === letterToRow(position[0])) {
      return row.map((col, colIndex) => {
        if (colIndex === Number(position[1])) {
          return 1;
        }
      });
    }
    return row;
  });

  return mergeObjs(state, {
    [currentPlayer]: { ...state[currentPlayer], ships }
  });
};

const countShips = (state, playerNum) => {
  const player = `player${playerNum}`;
  return state[player].ships.reduce((rowAcc, row) => {
    return (
      rowAcc +
      row.reduce((colAcc, col) => {
        return colAcc + (col || 0);
      }, 0)
    );
  }, 0);
};

module.exports = {
  initialState,
  placeShip,
  countShips
};
