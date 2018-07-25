//Simple functional testing framework
const logPassed = title => console.log("\x1b[32m%s\x1b[0m", `PASSED: ${title}`);

const logFailed = title => console.log("\x1b[31m%s\x1b[0m", `FAILED: ${title}`);

const section = title => console.log("\n\x1b[47m\x1b[30m%s\x1b[0m", title);

const it = title => func => (func ? logPassed(title) : logFailed(title));

const equal = a => b => a === b;

// Test the test framework
section("Testing Framework");

it("true should pass")(true);

it("false should fail")(false);

it("equal should pass")(equal(2)(2));
