const path = require("path");
const chai = require("chai");
const circom_tester = require("circom_tester");

const assert = chai.assert;
const wasm_tester = circom_tester.wasm;

const fs = require("fs");
const ethers = require("ethers");
const { output_merkle_proof } = require("./utils/merkle_tree_helper");

/**
 * Generates a merkle tree proof as input to VerifyBranch.
 *
 * @param {number} merkle_proof_length length of merkle proof
 * @param {boolean} real if true, leaves are ETH addresses, otherwise they are
 * random numbers
 * @returns JS object with fields of leaf, root, branch, and branch_side
 * corresponding to
 */
function gen_input(merkle_proof_length, real) {
  let leaves = new Array(2 ** merkle_proof_length);

  for (let ind = 0; ind < 2 ** merkle_proof_length; ind++) {
    if (real) {
      wallet = ethers.Wallet.createRandom();
      leaves[ind] = BigInt(wallet.address);
    } else {
      leaves[ind] = Math.floor(Math.random() * 100);
    }
  }

  let rand_leaf_ind = Math.floor(Math.random() * 2 ** merkle_proof_length);
  return output_merkle_proof(merkle_proof_length, leaves, rand_leaf_ind);
}

/**
 * Outputs merkle tree proof to a json file.
 *
 * @param {number} tree_depth
 * @param {boolean} real to use public keys or random numbers
 * @param {string} filename without .json
 */
function gen_json_input(merkle_proof_length, real, filename) {
  let output = gen_input(merkle_proof_length, real);
  file_output = JSON.stringify(output);
  fs.writeFileSync(filename + ".json", file_output, (err) => {
    if (err) {
      throw err;
    }
    console.log("JSON data is saved.");
  });
}

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
      path.join(__dirname, "circuits", "verify_branch_7.circom")
    );
    await circuit.loadConstraints();

    let testData = gen_input(7, true);

    const witness = await circuit.calculateWitness(testData, true);
    await circuit.checkConstraints(witness);
  });

  it("verify branch of depth 11 passes with random numbers", async () => {
    let circuit = await wasm_tester(
      path.join(__dirname, "circuits", "verify_branch_11.circom")
    );
    await circuit.loadConstraints();

    let testData = gen_input(11, false);

    const witness = await circuit.calculateWitness(testData, true);
    await circuit.checkConstraints(witness);
  });
});
