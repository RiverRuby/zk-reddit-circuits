const fs = require("fs");
const ethers = require("ethers");
const { output_merkle_proof } = require("./merkle_tree_helper");

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

module.exports = {
  gen_input,
  gen_json_input,
};
