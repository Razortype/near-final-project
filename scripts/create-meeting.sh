#!/usr/bin/env bash

# exit on first error after this point to avoid redeploying with successful build
set -e

echo
echo
echo ---------------------------------------------------------
echo "Meeting is creating.."
echo ---------------------------------------------------------
echo

near call $CONTRACT createMeeting --accountId razortype.testnet

echo
echo
echo ---------------------------------------------------------
echo "Meeting created succesfully!"
echo ---------------------------------------------------------
echo

exit 0
