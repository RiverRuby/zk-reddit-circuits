#!/bin/bash

CIRCUIT_NAME=$1
BUILD_DIR="../../build/$CIRCUIT_NAME"

echo "** Exporting vkey"
start=`date +%s`
set -x
snarkjs zkey export verificationkey "$BUILD_DIR"/"$CIRCUIT_NAME".zkey "$BUILD_DIR"/vkey.json
end=`date +%s`
{ set +x; } 2>/dev/null
echo "DONE ($((end-start))s)"
echo