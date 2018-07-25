const bs = require("./battleshipt");

console.log(bs.initialState());

//Simple functional testing framework
const logPassed = title => console.log("\x1b[32m%s\x1b[0m", `PASSED: ${title}`);

const logFailed = title => console.log("\x1b[31m%s\x1b[0m", `FAILED: ${title}`);

const section = title => console.log("\n\x1b[47m\x1b[30m %s \x1b[0m", title);

const it = title => func => {
  const output = typeof func === "function" ? func() : func;
  return output === true ? logPassed(title) : logFailed(title);
};

const equal = a => b => a === b;

const deepEqual = a => b => JSON.stringify(a) === JSON.stringify(b);

// Test the test framework
section("Testing Framework");

it("true should pass")(true);

it("false should fail")(false);

it("equal should pass")(equal(2)(2));

// Test battleshipt core
section("Battleshipt Core");

it("return initial state")(() => {
  const expected = {};

  return deepEqual(bs.initialState())(expected);
});
