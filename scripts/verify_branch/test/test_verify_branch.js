const path = require("path");
const chai = require("chai");
const circom_tester = require("circom_tester");

const assert = chai.assert;
const wasm_tester = circom_tester.wasm;

describe("verify branch depth of 8", function () {
  this.timeout(100000);

  let circuit;
  before(async () => {
    console.log(__dirname);
    circuit = await wasm_tester(path.join(__dirname, "verify_branch_8.circom"));
    await circuit.loadConstraints();
  });

  const testData = require("../input_verify_branch.json");

  it("adheres to sanity test", async () => {
    const witness = await circuit.calculateWitness(testData, true);
  });
});
