#!/usr/bin/env bash
# [MISE] depends=["fonts.setup"]
# [MISE] sources=["./sources/linear-rotation/config*.yaml", "./sources/linear-rotation/*.glyphspackage"]
# [MISE] outputs=["fonts/linear-rotation/**/*"]

set -euo pipefail

rm -rf ./fonts/linear-rotation

gftools builder ./sources/linear-rotation/config-linear-rotation.yaml
