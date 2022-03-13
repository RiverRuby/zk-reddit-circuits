pragma circom 2.0.2;

include "../../circuits/merkle_tree.circom";

component main {public [leaf, root, branch, branch_side]} = 
    VerifyBranch(7);