pragma circom 2.0.2;

include "../node_modules/circomlib/circuits/mimcsponge.circom";

// copied from https://github.com/tornadocash/tornado-core/ & rewritten

// Returns MiMC(left, right)
template HashLeftRight() {
    signal input left;
    signal input right;
    signal output hash;

    component hash_func = MiMCSponge(2, 220, 1);
    hash_func.ins[0] <== left;
    hash_func.ins[1] <== right;
    hash_func.k <== 0;
    
    hash <== hash_func.outs[0];
}

// if s == 0, return [in[0], in[1]]
// if s == 1, return [in[1], in[0]]
// needed for hashing merkle branches properly
template Swap() {
    signal input s;
    signal input in[2];
    signal output out[2];

    s * (1-s) === 0;
    out[0] <== (in[1] - in[0]) * s + in[0];
    out[1] <== (in[0] - in[1]) * s + in[1];
}

// Verify leaf is in tree with merkle branch and root
// branch_side[i] = 0 if branch[i] is on left, 1 if on right
template VerifyBranch(depth) {
    signal input leaf;
    signal input root;
    signal input branch[depth];
    signal input branch_side[depth];

    component swapper[depth];
    component hash_func[depth];
    
    for (var i = 0; i < depth; i++) {
        // TODO: may need to swap inputs to swapper
        swapper[i] = Swap();
        swapper[i].s <== branch_side[i];
        swapper[i].in[0] <== (i == 0) ? leaf : hash_func[i-1].hash;
        swapper[i].in[1] <== branch[i];

        hash_func[i] = HashLeftRight();
        hash_func[i].left <== swapper[i].out[0];
        hash_func[i].right <== swapper[i].out[1];
    }

    root === hash_func[depth-1].hash;
}
