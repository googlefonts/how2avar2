#!/usr/bin/env bash
# [MISE] depends=["fonts.setup"]
# [MISE] sources=["scripts/fix-axis-bounds.py", "sources/quadratic-rotation/config*.yaml", "sources/quadratic-rotation/*.glyphspackage", "sources/quadratic-rotation/*.designspace"]
# [MISE] outputs=["fonts/quadratic-rotation/**/*"]

set -euo pipefail

rm -rf ./fonts/quadratic-rotation

gftools builder ./sources/quadratic-rotation/config-quadratic-rotation.yaml

# fix ZROT axis
./scripts/fix-axis-bounds.py --inplace --axis ZROT --min 0 --max 90 "./fonts/quadratic-rotation/variable/QuadraticRotation[AAAA,BBBB,ZROT].ttf"

# create Avar1 demo with quadratic rotation
python3 ./scripts/avar1-quadratic-rotation.py

# create Avar2 demo with quadratic rotation
fonttools varLib.avar.build -o "./fonts/quadratic-rotation/variable/QuadraticRotationAvar2[AAAA,BBBB,ZROT].ttf" "./fonts/quadratic-rotation/variable/QuadraticRotation[AAAA,BBBB,ZROT].ttf" "./sources/quadratic-rotation/avar2QuadraticRotation.designspace"
