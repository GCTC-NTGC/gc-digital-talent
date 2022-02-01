#! /usr/bin/env bash

# Use some common shell options for error handling and output.
# See: https://tldp.org/LDP/abs/html/options.html

# Script exits when command fails.
set -o errexit

# Don't mask errors in piped commands (raise first non-zero exit code).
set -o pipefail

# Print commands (and bash scripts/source files) while executing.
# Scripts get very noisy. Uncomment for debugging.
#set -o verbose

# Fail if using undefined variables.
set -o nounset
