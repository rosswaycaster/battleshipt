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

// Test the test framework
section("Testing Framework");

it("true should pass")(true);

it("false should fail")(false);

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

it("place player 1 ship on grid")(() => {
  const beforeState = {
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

  const afterState = {
    multiPlayer: null,
    currentPlayer: 1,
    player1: {
      ships: [
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, 1, undefined, undefined, undefined],
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

  return deepEqual(bs.placeShip(beforeState, 1, "B1"), afterState);
});

it("place player 2 ship on grid")(() => {
  const beforeState = {
    multiPlayer: null,
    currentPlayer: 2,
    player1: {
      ships: [
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, 1, undefined, undefined, undefined],
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

  const afterState = {
    multiPlayer: null,
    currentPlayer: 2,
    player1: {
      ships: [
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, 1, undefined, undefined, undefined],
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
        [undefined, undefined, 1, undefined, undefined]
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

  return deepEqual(bs.placeShip(beforeState, 2, "E2"), afterState);
});

it("place player 1 hit on grid")(() => {
  const beforeState = {
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
        [undefined, undefined, 1, undefined, undefined],
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

  return deepEqual(bs.placeHit(beforeState, 1, "D2"), afterState);
});

it("place player 2 hit on grid")(() => {
  const beforeState = {
    multiPlayer: null,
    currentPlayer: 2,
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

  const afterState = {
    multiPlayer: null,
    currentPlayer: 2,
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
        [undefined, undefined, 1, undefined, undefined]
      ]
    }
  };

  return deepEqual(bs.placeHit(beforeState, 2, "E2"), afterState);
});

it("return number of ships placed")(() => {
  const beforeState = {
    multiPlayer: null,
    currentPlayer: 1,
    player1: {
      ships: [
        [1, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, 1, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, 1, undefined, undefined, undefined]
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

  return equal(bs.countShips(beforeState, 1), 3);
});

it("can place ship")(() => {
  const beforeState = {
    multiPlayer: null,
    currentPlayer: 1,
    player1: {
      ships: [
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, 1, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, 1, undefined, undefined, undefined]
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

  return equal(bs.canPlace(beforeState, 1, "ships", "A1"), true);
});

it("can't place ship")(() => {
  const beforeState = {
    multiPlayer: null,
    currentPlayer: 1,
    player1: {
      ships: [
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, 1, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined],
        [undefined, 1, undefined, undefined, undefined]
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

  return equal(bs.canPlace(beforeState, 1, "ships", "E1"), false);
});
