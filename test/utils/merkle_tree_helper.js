const mimcfs = require("./mimc.js");

function output_merkle_proof(merkle_proof_length, leaves, rand_leaf_ind) {
  let tree_depth = merkle_proof_length + 1;
  let num_nodes = 2 ** tree_depth;
  let tree_nodes = new Array(num_nodes);

  for (let ind = num_nodes / 2; ind < num_nodes; ind++) {
    tree_nodes[ind] = leaves[ind - num_nodes / 2];
  }

  // inputted leaf ind must be shifted when used in the full tree
  let leaf_ind = rand_leaf_ind + num_nodes / 2;

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

module.exports = {
  output_merkle_proof,
};
