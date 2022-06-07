pragma circom 2.0.2;

// Dummy circuit used in place of dao hack circuit for frontend testing
template Dummy(k) {
    signal input root;
    signal input branch[0];
    signal input branch_side[0];

    signal input r[k];
    signal input s[k];
    signal input msghash[k];
    signal input pubkey[2][k];

    1 === 1;
}

component main {public [root, msghash]} = Dummy(4);