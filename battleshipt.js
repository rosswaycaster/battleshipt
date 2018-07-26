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
const letterToRow = row => letters.indexOf(row.toUpperCase());

//Return object of row & column indexs from position string
const positionIndexes = position => ({
  rowIndex: letterToRow(position[0]),
  colIndex: Number(position[1])
});

//Return an updated state with ship/hit placed
const place = (state, playerNum, type, position) => {
  const player = `player${playerNum}`;
  const { rowIndex, colIndex } = positionIndexes(position);

  const grid = state[player][type].map((row, index) => {
    if (index === rowIndex) {
      return row.map((col, index) => (index === colIndex ? 1 : col));
    }
    return row;
  });

  return mergeObjs(state, {
    [player]: { ...state[player], [type]: grid }
  });
};

//Easily place a ship
const placeShip = (state, playerNum, position) =>
  place(state, playerNum, "ships", position);

//Easily place a hit
const placeHit = (state, playerNum, position) =>
  place(state, playerNum, "hits", position);

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
  positionValue(state, playerNum, type, position) === undefined;

//Return boolean if ship was hit
const didHit = (state, playerNum, position) =>
  positionValue(state, playerNum, "ships", position) === 1;

module.exports = {
  initialState,
  placeShip,
  placeHit,
  countShips,
  canPlace,
  didHit
};
