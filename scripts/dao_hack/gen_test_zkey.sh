#!/bin/bash

CIRCUIT_NAME=$1
BUILD_DIR="../../build/$CIRCUIT_NAME"
R1CS_FILE="$BUILD_DIR/$CIRCUIT_NAME.r1cs"
PHASE1=$2

echo "****GENERATING ZKEY 0****"
start=`date +%s`
set -x
snarkjs zkey new "$R1CS_FILE" "$PHASE1" "$BUILD_DIR/$CIRCUIT_NAME"_0.zkey -v
{ set +x; } 2>/dev/null
end=`date +%s`
echo "DONE ($((end-start))s)"
echo

# NOTE: don't use this in prod! use real entropy (i.e. from dao hack blockhash) for this
echo "****GENERATING FINAL ZKEY****"
start=`date +%s`
set -x
snarkjs zkey beacon "$BUILD_DIR"/"$CIRCUIT_NAME"_0.zkey "$BUILD_DIR"/"$CIRCUIT_NAME".zkey 0102030405060708090a0b0c0d0e0f101112231415161718221a1b1c1d1e1f 10 -n="Final Beacon phase2"
{ set +x; } 2>/dev/null
end=`date +%s`
echo "DONE ($((end-start))s)"
echo
