const path = require("path");
const chai = require("chai");
const circom_tester = require("circom_tester");

const assert = chai.assert;
const wasm_tester = circom_tester.wasm;

const { BigInteger } = require("big-integer");
const ethers = require("ethers");
const { output_merkle_proof } = require("./utils/merkle_tree_helper");

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

async function gen_sig_input(merkle_proof_length, n, k) {
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
    n,
    k,
    BigInt("0x" + wallets[rand_leaf_ind].publicKey.slice(4, 4 + 64))
  ).map((el) => el.toString());
  proof.pubkey[1] = bigint_to_array(
    n,
    k,
    BigInt("0x" + wallets[rand_leaf_ind].publicKey.slice(68, 68 + 64))
  ).map((el) => el.toString());

  let message = "Hello world!";
  let signature = await wallets[rand_leaf_ind].signMessage(message);

  proof.r = bigint_to_array(
    n,
    k,
    BigInt("0x" + signature.slice(2, 2 + 64))
  ).map((el) => el.toString());
  proof.s = bigint_to_array(
    n,
    k,
    BigInt("0x" + signature.slice(66, 66 + 64))
  ).map((el) => el.toString());
  proof.msghash = bigint_to_array(
    n,
    k,
    BigInt(ethers.utils.hashMessage(message))
  ).map((el) => el.toString());

  return proof;
}

describe("verify group message nosig", function () {
  this.timeout(100000);

  it("merkle proof of depth 7", async () => {
    let circuit = await wasm_tester(
      path.join(__dirname, "circuits", "group_message_nosig_86_3_7.circom")
    );
    await circuit.loadConstraints();

    let testData = await gen_nosig_input(7);
    console.log(JSON.stringify(testData));

    const witness = await circuit.calculateWitness(testData, true);
    await circuit.checkConstraints(witness);
  });
});

describe("verify group message with sig", function () {
  this.timeout(1200000);

  it("merkle proof of depth 7", async () => {
    let circuit = await wasm_tester(
      path.join(__dirname, "circuits", "group_message_64_4_7.circom")
    );
    await circuit.loadConstraints();

    let testData = await gen_sig_input(7, 64, 4);
    console.log(JSON.stringify(testData));

    const witness = await circuit.calculateWitness(testData, true);
    await circuit.checkConstraints(witness);
  });
});
