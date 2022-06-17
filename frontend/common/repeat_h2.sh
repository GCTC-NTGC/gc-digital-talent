#!/usr/bin/env bash

set -e

for i in {1..5}
do
  echo "Hydrogen run #$i"
  npm run h2-build
done
