#!/bin/sh
set -e
pnpm install
exec "$@"
