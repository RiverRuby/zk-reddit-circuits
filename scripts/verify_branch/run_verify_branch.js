const snarkjs = require("snarkjs");
const fs = require("fs");

async function run() {
  const buildDir = "../../build/verify_branch/";
  const circuitName = "verify_branch";
  const testData = require("./input_verify_branch.json");

  console.log(testData);
  console.log(buildDir + circuitName + "_js/" + circuitName + ".wasm");
  console.log(buildDir + circuitName + "_0.zkey");

  const { proof, publicSignals } = await snarkjs.groth16.fullProve(
    testData,
    buildDir + circuitName + "_js/" + circuitName + ".wasm",
    buildDir + circuitName + ".zkey"
  );

  console.log("Proof: ");
  console.log(JSON.stringify(proof, null, 1));

  const vKey = JSON.parse(fs.readFileSync(buildDir + "vkey.json"));

  const res = await snarkjs.groth16.verify(vKey, publicSignals, proof);

  if (res === true) {
    console.log("Verification OK");
  } else {
    console.log("Invalid proof");
  }
}

run().then(() => {
  process.exit(0);
});
