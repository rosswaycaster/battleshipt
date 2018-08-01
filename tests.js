const bs = require("./battleshipt");

//Simple functional testing framework
const logPassed = title => console.log("\x1b[32m%s\x1b[0m", `PASSED: ${title}`);

const logFailed = title => console.log("\x1b[31m%s\x1b[0m", `FAILED: ${title}`);

const section = title => console.log("\n\x1b[47m\x1b[30m %s \x1b[0m", title);

const it = title => func => {
  const output = typeof func === "function" ? func() : func;
  return output === true ? logPassed(title) : logFailed(title);
};

const equal = (a, b) => a === b;

const deepEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);

//Start the timer
console.time("Execution Time");

// Test the test framework
section("Testing Framework");

it("true should pass")(true);

it("false should fail (should be red)")(false);

it("equal should pass")(equal(2, 2));

// Test battleshipt core
section("Battleshipt Core");

it("return initial state")(() => {
  const afterState = {
    multiPlayer: null,
    currentPlayer: 1,
    player1: {
      ships: [
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined]
      ],
      hits: [
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined]
      ]
    },
    player2: {
      ships: [
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined]
      ],
      hits: [
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined]
      ]
    }
  };

  return deepEqual(bs.initialState(), afterState);
});

it("return valid random ship position")(() => {
  const beforeState = {
    player1: {
      ships: [
        [1, 1, 1, 1, 1],
        [1, undefined, 1, 1, 1],
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1]
      ]
    }
  };

  return equal(bs.randomShipPosition(beforeState, 1), "B1");
});

it("place player 1 ship on grid")(() => {
  const beforeState = {
    player1: {
      ships: [
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined]
      ]
    }
  };

  const afterState = {
    player1: {
      ships: [
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, 1, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined]
      ]
    }
  };

  return deepEqual(bs.placeShip(beforeState, 1, "B1"), afterState);
});

it("place player 2 ship on grid")(() => {
  const beforeState = {
    player2: {
      ships: [
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined]
      ]
    }
  };

  const afterState = {
    player2: {
      ships: [
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, 1, undefined, undefined]
      ]
    }
  };

  return deepEqual(bs.placeShip(beforeState, 2, "E2"), afterState);
});

it("place player 1 hit on grid")(() => {
  const beforeState = {
    player1: {
      hits: [
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined]
      ]
    }
  };

  const afterState = {
    player1: {
      hits: [
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, 1, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined]
      ]
    }
  };

  return deepEqual(bs.placeHit(beforeState, 1, "D2"), afterState);
});

it("place player 2 hit on grid")(() => {
  const beforeState = {
    player2: {
      hits: [
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined]
      ]
    }
  };

  const afterState = {
    player2: {
      hits: [
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, 1, undefined, undefined]
      ]
    }
  };

  return deepEqual(bs.placeHit(beforeState, 2, "E2"), afterState);
});

it("place player 2 hit on grid as a miss")(() => {
  const beforeState = {
    player2: {
      hits: [
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined]
      ]
    }
  };

  const afterState = {
    player2: {
      hits: [
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, 0, undefined, undefined]
      ]
    }
  };

  return deepEqual(bs.placeMiss(beforeState, 2, "E2", 0), afterState);
});

it("return number of ships for player")(() => {
  const beforeState = {
    player1: {
      ships: [
        [1, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, 1, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, 1, undefined, undefined, undefined]
      ]
    }
  };

  return equal(bs.countShips(beforeState, 1), 3);
});

it("return number of hits for player")(() => {
  const beforeState = {
    player2: {
      hits: [
        [undefined, undefined, undefined, undefined, undefined],
        [0, undefined, 1, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined],
        [1, undefined, undefined, 0, undefined],
        [undefined, undefined, undefined, undefined, 1]
      ]
    }
  };

  return equal(bs.countHits(beforeState, 2), 3);
});

it("can place ship")(() => {
  const beforeState = {
    player1: {
      ships: [
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, 1, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, 1, undefined, undefined, undefined]
      ]
    }
  };

  return equal(bs.canPlaceShip(beforeState, 1, "A1"), true);
});

it("can't place ship")(() => {
  const beforeState = {
    player1: {
      ships: [
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, 1, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, 1, undefined, undefined, undefined]
      ]
    }
  };

  return equal(bs.canPlaceShip(beforeState, 1, "E1"), false);
});

it("can place hit")(() => {
  const beforeState = {
    player1: {
      hits: [
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, 1, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, 1, undefined]
      ]
    }
  };

  return equal(bs.canPlaceHit(beforeState, 1, "A1"), true);
});

it("can't place hit")(() => {
  const beforeState = {
    player1: {
      hits: [
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, 1, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, 1, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined]
      ]
    }
  };

  return equal(bs.canPlaceHit(beforeState, 1, "B1"), false);
});

it("did hit ship")(() => {
  const beforeState = {
    player1: {
      ships: [
        [undefined, 1, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined]
      ]
    }
  };

  return equal(bs.didHitShip(beforeState, 1, "A1"), true);
});

it("did not hit ship")(() => {
  const beforeState = {
    player1: {
      ships: [
        [undefined, 1, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined]
      ]
    }
  };

  return equal(bs.didHitShip(beforeState, 1, "B4"), false);
});

it("toggle current player from 1 to 2")(() => {
  const beforeState = {
    currentPlayer: 1
  };

  const afterState = {
    currentPlayer: 2
  };

  return deepEqual(bs.togglePlayer(beforeState), afterState);
});

it("toggle current player from 2 to 1")(() => {
  const beforeState = {
    currentPlayer: 2
  };

  const afterState = {
    currentPlayer: 1
  };

  return deepEqual(bs.togglePlayer(beforeState), afterState);
});

it("player 1 is winner")(() => {
  const beforeState = {
    player1: {
      hits: [
        [undefined, 1, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, 1, undefined, undefined, undefined],
        [undefined, undefined, undefined, 1, undefined]
      ]
    }
  };

  return equal(bs.hasWinner(beforeState), 1);
});

it("player 2 is winner")(() => {
  const beforeState = {
    player1: {
      hits: [
        [undefined, 1, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, 1, undefined]
      ]
    },
    player2: {
      hits: [
        [undefined, 1, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, 1, undefined, undefined, undefined],
        [undefined, undefined, undefined, 1, undefined]
      ]
    }
  };

  return equal(bs.hasWinner(beforeState), 2);
});

it("there is no winner")(() => {
  const beforeState = {
    player1: {
      hits: [
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, 1, undefined, undefined, undefined],
        [undefined, undefined, undefined, 1, undefined]
      ]
    },
    player2: {
      hits: [
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, 1, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, 1, undefined]
      ]
    }
  };

  return equal(bs.hasWinner(beforeState), false);
});

//Stop and log the timer
console.timeEnd("Execution Time");
