pragma circom 2.0.2;

include "../../node_modules/circomlib/circuits/mimcsponge.circom"
include "circom-ecdsa/circuits/ecdsa.circom"

// signature (r, s), msghash, and pubkey have coordinates
// encoded with k registers of n bits each
template GroupMembershipMessageSign(n, k) {
    // TODO: check public key is valid
}