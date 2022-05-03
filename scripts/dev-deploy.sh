#!/usr/bin/env bash

set -e

echo
echo ---------------------------------------------------------
echo "Step 1: Build the contract (may take a few seconds)"
echo ---------------------------------------------------------
echo

yarn build:release

echo
echo
echo ---------------------------------------------------------
echo "Deploy the contract"
echo ---------------------------------------------------------
echo

near dev-deploy ./build/debug/singleton.wasm

exit 0
