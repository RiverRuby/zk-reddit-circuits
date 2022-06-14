pragma circom 2.0.2;

include "../../circom-ecdsa/circuits/ecdsa.circom";

// NOTE: purely for sanity testing sig verification in circom
template SigVerify() {
    signal input r[4];
    signal input s[4];
    signal input msghash[4];
    signal input pubkey[2][4];

    component sigVerify = ECDSAVerifyNoPubkeyCheck(64, 4);
    for (var i = 0; i < 4; i++) {
        sigVerify.r[i] <== r[i];
        sigVerify.s[i] <== s[i];
        sigVerify.msghash[i] <== msghash[i];
        for (var j = 0; j < 2; j++) {
            sigVerify.pubkey[j][i] <== pubkey[j][i];
        }
    }
    sigVerify.result === 1;
}

component main = SigVerify();