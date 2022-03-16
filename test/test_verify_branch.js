const gen_test = require("./utils/generate_verify_branch_test.js");

const path = require("path");
const chai = require("chai");
const circom_tester = require("circom_tester");

const assert = chai.assert;
const wasm_tester = circom_tester.wasm;

describe("verify branch", function () {
  this.timeout(100000);

  /**
   * Testing strategy
   *
   * 1) depths: 7, 11
   * 2) leaf nodes: random numbers, eth addresses
   */

  it("verify branch of depth 7 passes with addresses", async () => {
    let circuit = await wasm_tester(
      path.join(__dirname, "specific_circuits", "verify_branch_7.circom")
    );
    await circuit.loadConstraints();

    let testData = gen_test.gen_input(7, true);

    const witness = await circuit.calculateWitness(testData, true);
    await circuit.checkConstraints(witness);
  });

  it("verify branch of depth 11 passes with random numbers", async () => {
    let circuit = await wasm_tester(
      path.join(__dirname, "specific_circuits", "verify_branch_11.circom")
    );
    await circuit.loadConstraints();

    let testData = gen_test.gen_input(11, false);

    const witness = await circuit.calculateWitness(testData, true);
    await circuit.checkConstraints(witness);
  });
});
