#!/usr/bin/env bash
# [MISE] description="Install git submodules"

set -euo pipefail

git submodule update --init --recursive --recommend-shallow --progress
