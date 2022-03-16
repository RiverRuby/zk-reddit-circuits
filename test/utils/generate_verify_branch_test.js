const mimcfs = require("./mimc.js");
const fs = require("fs");
const ethers = require("ethers");
const keccak256 = require("keccak256");

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
  let tree_depth = merkle_proof_length + 1;
  let tree_nodes = new Array(2 ** tree_depth);
  let num_nodes = 2 ** tree_depth;

  for (let ind = num_nodes / 2; ind < num_nodes; ind++) {
    if (real) {
      wallet = ethers.Wallet.createRandom();
      tree_nodes[ind] = BigInt(wallet.address);
    } else {
      tree_nodes[ind] = Math.floor(Math.random() * 100);
    }
  }

  let leaf_ind = Math.floor((Math.random() * num_nodes) / 2) + num_nodes / 2;
  let bro_ind = leaf_ind % 2 == 0 ? leaf_ind + 1 : leaf_ind - 1;
  let branch = [];
  let branch_side = [];

  for (let ind = num_nodes / 2 - 1; ind > 0; ind--) {
    tree_nodes[ind] = mimcfs.mimcHash(0)(
      tree_nodes[2 * ind],
      tree_nodes[2 * ind + 1]
    );

    // see if the node we just computed involves the curernt
    // sibling node of our merkle path
    if (2 * ind == bro_ind) {
      branch.push(tree_nodes[2 * ind]);
      branch_side.push(1);
      bro_ind = ind % 2 == 0 ? ind + 1 : ind - 1;
    } else if (2 * ind + 1 == bro_ind) {
      branch.push(tree_nodes[2 * ind + 1]);
      branch_side.push(0);
      bro_ind = ind % 2 == 0 ? ind + 1 : ind - 1;
    }
  }

  return {
    leaf: tree_nodes[leaf_ind].toString(),
    root: tree_nodes[1].toString(),
    branch: branch.map((el) => el.toString()),
    branch_side: branch_side.map((el) => el.toString()),
  };
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
