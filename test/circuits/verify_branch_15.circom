pragma circom 2.0.2;

include "../../circuits/merkle_tree.circom";

component main {public [root]} = 
    VerifyBranch(15);