pragma circom 2.0.2;

include "../node_modules/circomlib/circuits/mimcsponge.circom";
include "../ecdsa-circuits/zk-identity/pubkey_to_address.circom";
include "./merkle_tree.circom";

// signature (r, s), msghash, and pubkey have coordinates encoded with k registers of n bits each
// merkle tree has depth d
template GroupMembershipMessageNoSign(n, k, d) {
    assert(k >= 2);
    assert(k <= 100);
    
    /*
        This is a stripped version of main circuit to make sure certain inputs work.

        Steps
        1) get address associated with public key
        2) verify address is in group with merkle tree proof
    */

    signal input root;
    signal input branch[d];
    signal input branch_side[d];
    signal input pubkey[2][k];

    // Step 1: get address associated with public key
    // adapted from https://github.com/jefflau/zk-identity
    signal pubkeyBits[512];
    signal address;

    component flattenPubkey = FlattenPubkey(n, k);
    for (var i = 0; i < k; i++) {
        flattenPubkey.chunkedPubkey[0][i] <== pubkey[0][i];
        flattenPubkey.chunkedPubkey[1][i] <== pubkey[1][i];
    }
    for (var i = 0; i < 512; i++) {
        pubkeyBits[i] <== flattenPubkey.pubkeyBits[i];
    }
    component pubkeyToAddress = PubkeyToAddress();
    for (var i = 0; i < 512; i++) {
        pubkeyToAddress.pubkeyBits[i] <== pubkeyBits[i];
    }
    address <== pubkeyToAddress.address;

    // Step 2: verify address is in group with merkle tree proof
    component verifyMerkleProof = VerifyBranch(d);
    verifyMerkleProof.leaf <== address;
    verifyMerkleProof.root <== root;
    for (var i = 0; i < d; i++) {
        verifyMerkleProof.branch[i] <== branch[i];
        verifyMerkleProof.branch_side[i] <== branch_side[i];
    }
}