#!/usr/bin/env bash
# [MISE] depends=["fonts.setup"]
# [MISE] sources=["scripts/fix-axis-bounds.py", "scripts/rename-fonts.py", "sources/test-font/config*.yaml", "sources/test-font/*.glyphspackage", "sources/designspaces/*.designspace"]
# [MISE] outputs=["fonts/test-font/**/*"]

set -euo pipefail

rm -rf ./fonts/test-font

# build base font
gftools builder ./sources/test-font/config-test-font.yaml

# fix opsz axis
./scripts/fix-axis-bounds.py --inplace --axis opsz --min 6 --max 144 "./fonts/test-font/variable/TestFont[opsz,wdth,wght].ttf"

# create Avar1 demo with axis mappings
fonttools varLib.avar.build -o "./fonts/test-font/variable/TestFontAvar1[opsz,wdth,wght].ttf" "./fonts/test-font/variable/TestFont[opsz,wdth,wght].ttf" "./sources/designspaces/avar1.designspace"
./scripts/rename-fonts.py --inplace --suffix " Avar1" "./fonts/test-font/variable/TestFontAvar1[opsz,wdth,wght].ttf"

# create Avar2 demo with axis mappings
fonttools varLib.avar.build -o "./fonts/test-font/variable/TestFontAvar2[opsz,wdth,wght].ttf" "./fonts/test-font/variable/TestFont[opsz,wdth,wght].ttf" "./sources/designspaces/avar2.designspace"
./scripts/rename-fonts.py --inplace --suffix " Avar2" "./fonts/test-font/variable/TestFontAvar2[opsz,wdth,wght].ttf"

# create Avar2 demo with fences
fonttools varLib.avar.build -o "./fonts/test-font/variable/TestFontFencesAvar2[opsz,wdth,wght].ttf" "./fonts/test-font/variable/TestFont[opsz,wdth,wght].ttf" "./sources/designspaces/avar2Fences.designspace"
./scripts/rename-fonts.py --inplace --suffix " Fences Avar2" "./fonts/test-font/variable/TestFontFencesAvar2[opsz,wdth,wght].ttf"

# create Avar2 demo with optical size
fonttools varLib.avar.build -o "./fonts/test-font/variable/TestFontOpticalSizeAvar2[opsz,wdth,wght].ttf" "./fonts/test-font/variable/TestFont[opsz,wdth,wght].ttf" "./sources/designspaces/avar2OpticalSize.designspace"
./scripts/rename-fonts.py --inplace --suffix " Optical Size Avar2" "./fonts/test-font/variable/TestFontOpticalSizeAvar2[opsz,wdth,wght].ttf"
