//Return the initial state of the game
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

//Possible position letters
const letters = "ABCDE";

//Number of ships per player
const numberOfShips = 3;

//Return boolean if is a valid answer
const verifyMultiplayerAnswer = answer => answer === "M" || answer === "C";

//Return an updated state with multiplayer option set
const multiplayerState = (state, answer) =>
  mergeObjs(state, { multiPlayer: answer === "M" ? true : false });

//Return the index of the letter
const letterToRow = letter => letters.indexOf(letter.toUpperCase());

//Return player number string
const playerString = playerNum => `player${playerNum}`;

//Return object of row & column indexes from position string
const positionIndexes = position => ({
  rowIndex: letterToRow(position[0]),
  colIndex: Number(position[1])
});

//Return a random number from 0 - 4 inclusive
const randomNum = () => Math.floor(Math.random() * 5);

//Return a random position
const randomPosition = () => {
  const row = letters[randomNum()];
  const col = randomNum();

  return `${row}${col}`;
};

//Return a random ship position that can be placed
const randomShipPosition = (state, playerNum) => {
  const position = randomPosition();

  if (canPlaceShip(state, playerNum, position)) {
    return position;
  }

  return randomShipPosition(state, playerNum);
};

//Return a random hit position that can be placed
const randomHitPosition = (state, playerNum) => {
  const position = randomPosition();

  if (canPlaceHit(state, playerNum, position)) {
    return position;
  }

  return randomHitPosition(state, playerNum);
};

//Return an updated state with ship/hit placed
const place = (state, playerNum, type, position, value = 1) => {
  const player = playerString(playerNum);
  const { rowIndex, colIndex } = positionIndexes(position);

  const grid = state[player][type].map((row, index) => {
    if (index === rowIndex) {
      return row.map((col, index) => (index === colIndex ? value : col));
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

//Easily place a miss
const placeMiss = (state, playerNum, position) =>
  place(state, playerNum, "hits", position, 0);

//Return the number of ships/hits on players grid
const count = (state, playerNum, type) => {
  const player = playerString(playerNum);
  return state[player][type].reduce((rowAcc, row) => {
    return (
      rowAcc +
      row.reduce((colAcc, col) => {
        return colAcc + (col || 0);
      }, 0)
    );
  }, 0);
};

//Easily count ships
const countShips = (state, playerNum) => count(state, playerNum, "ships");

//Easily count hits
const countHits = (state, playerNum) => count(state, playerNum, "hits");

//Return value at position
const positionValue = (state, playerNum, type, position) => {
  const { rowIndex, colIndex } = positionIndexes(position);
  const player = playerString(playerNum);
  return state[player][type][rowIndex][colIndex];
};

//Return boolean if the position is possible on the grid
const validPosition = position =>
  position.length === 2 &&
  letterToRow(position[0]) > -1 &&
  Number(position[1]) <= 4 &&
  Number(position[1]) >= 0;

const naturalizePosition = position => {
  const reversed = position
    .split("")
    .reverse()
    .join("");
  return validPosition(reversed) ? reversed : position;
};

//Return boolean if ship/hit can be placed on board
const canPlace = (state, playerNum, type, position) =>
  positionValue(state, playerNum, type, position) === undefined;

//Easily check if ship can be placed
const canPlaceShip = (state, playerNum, position) =>
  canPlace(state, playerNum, "ships", position);

//Easily check if hit can be placed
const canPlaceHit = (state, playerNum, position) =>
  canPlace(state, playerNum, "hits", position);

//Return boolean if ship was hit
const didHitShip = (state, playerNum, position) =>
  positionValue(state, playerNum, "ships", position) === 1;

//Return the number of the other player
const otherPlayer = playerNum => (playerNum === 1 ? 2 : 1);

//Return an updated state with the current player toggled
const togglePlayer = state =>
  mergeObjs(state, { currentPlayer: otherPlayer(state.currentPlayer) });

//Check if there is a winner then return the winning player number
const hasWinner = state => {
  if (countHits(state, 1) === numberOfShips) {
    return 1;
  }

  if (countHits(state, 2) === numberOfShips) {
    return 2;
  }

  return false;
};

module.exports = {
  initialState,
  letters,
  playerString,
  verifyMultiplayerAnswer,
  multiplayerState,
  numberOfShips,
  validPosition,
  naturalizePosition,
  randomShipPosition,
  randomHitPosition,
  placeShip,
  placeHit,
  placeMiss,
  countShips,
  countHits,
  canPlaceShip,
  canPlaceHit,
  didHitShip,
  otherPlayer,
  togglePlayer,
  hasWinner
};
