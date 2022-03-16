const { BigInteger } = require("big-integer");
const ethers = require("ethers");
const { output_merkle_proof } = require("./merkle_tree_helper");

function bigint_to_array(n, k, x) {
  let divisor = 1n;
  for (var idx = 0; idx < n; idx++) {
    divisor = divisor * 2n;
  }

  let ret = [];
  var x_temp = BigInt(x);
  for (var idx = 0; idx < k; idx++) {
    ret.push(x_temp % divisor);
    x_temp = x_temp / divisor;
  }
  return ret;
}

function gen_nosig_input(merkle_proof_length) {
  let leaves = new Array(2 ** merkle_proof_length);
  let wallets = new Array(2 ** merkle_proof_length);

  for (let ind = 0; ind < 2 ** merkle_proof_length; ind++) {
    wallets[ind] = ethers.Wallet.createRandom();
    leaves[ind] = BigInt(wallets[ind].address);
  }

  let rand_leaf_ind = Math.floor(Math.random() * 2 ** merkle_proof_length);
  let proof = output_merkle_proof(merkle_proof_length, leaves, rand_leaf_ind);
  delete proof.leaf; // don't need as we are inputting the public key to circuit

  proof.pubkey = new Array(2);
  proof.pubkey[0] = bigint_to_array(
    86,
    3,
    BigInt("0x" + wallets[rand_leaf_ind].publicKey.slice(4, 4 + 64))
  ).map((el) => el.toString());
  proof.pubkey[1] = bigint_to_array(
    86,
    3,
    BigInt("0x" + wallets[rand_leaf_ind].publicKey.slice(68, 68 + 64))
  ).map((el) => el.toString());

  return proof;
}

module.exports = {
  gen_nosig_input,
};
