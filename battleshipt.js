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

//Return the index of the letter
const letterToRow = row => "ABCDF".indexOf(row);

//Return an updated state with ship placed
const placeShip = (state, position) => {
  const currentPlayer = `player${state.currentPlayer}`;

  const updatedShips = state[currentPlayer].ships.map((row, rowIndex) => {
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
    [currentPlayer]: { ...state[currentPlayer], ships: updatedShips }
  });
};

module.exports = {
  initialState,
  placeShip
};
