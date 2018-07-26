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

//Return object of row & column indexs from position string
const positionIndexes = position => ({
  rowIndex: letterToRow(position[0]),
  colIndex: Number(position[1])
});

//Return an updated state with ship placed
const placeShip = (state, playerNum, position) => {
  const player = `player${playerNum}`;
  const { rowIndex, colIndex } = positionIndexes(position);

  const ships = state[player].ships.map((row, index) => {
    if (index === rowIndex) {
      return row.map((col, index) => (index === colIndex ? 1 : col));
    }
    return row;
  });

  return mergeObjs(state, {
    [player]: { ...state[player], ships }
  });
};

//Return the number of ships on players grid
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

//Return value at position
const positionValue = (state, playerNum, type, position) => {
  const { rowIndex, colIndex } = positionIndexes(position);
  return state[`player${playerNum}`][type][rowIndex][colIndex];
};

//Return boolean if ship/hit can be placed on board
const canPlace = (state, playerNum, type, position) =>
  positionValue(state, playerNum, type, position) === undefined ? true : false;

module.exports = {
  initialState,
  placeShip,
  countShips,
  canPlace
};
