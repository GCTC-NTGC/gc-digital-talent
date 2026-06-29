#!/bin/sh
set -e
pnpm install --force
exec "$@"
