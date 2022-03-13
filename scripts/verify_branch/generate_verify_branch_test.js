const mimcfs = require("./mimc.js");
const fs = require("fs");

function gen_input(tree_depth) {
  let tree_nodes = new Array(2 ** tree_depth);
  let num_nodes = 2 ** tree_depth;

  for (let ind = num_nodes / 2; ind < num_nodes; ind++) {
    tree_nodes[ind] = Math.floor(Math.random() * 100);
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

    output = {
      leaf: tree_nodes[leaf_ind],
      root: tree_nodes[1],
      branch: branch,
      branch_side: branch_side,
    };

    file_output = JSON.stringify(output);
    fs.writeFileSync("input_verify_branch.json", file_output, (err) => {
      if (err) {
        throw err;
      }
      console.log("JSON data is saved.");
    });
  }
}

gen_input(8);
