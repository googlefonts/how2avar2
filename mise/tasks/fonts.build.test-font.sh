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

# create instances of the fences font
fonttools varLib.instancer "./fonts/test-font/variable/TestFontFencesAvar2[opsz,wdth,wght].ttf" wght=900 wdth=75 opsz=16 -o "./fonts/test-font/TestFontFencesBlackCondensed.ttf"
./scripts/rename-fonts.py --inplace --suffix " Black Condensed" "./fonts/test-font/TestFontFencesBlackCondensed.ttf"
fonttools varLib.instancer "./fonts/test-font/variable/TestFontFencesAvar2[opsz,wdth,wght].ttf" wght=400 wdth=100 opsz=16 -o "./fonts/test-font/TestFontFencesDefault.ttf"
./scripts/rename-fonts.py --inplace --suffix " Default" "./fonts/test-font/TestFontFencesDefault.ttf"

# create Avar2 demo with optical size
fonttools varLib.avar.build -o "./fonts/test-font/variable/TestFontOpticalSizeAvar2[opsz,wdth,wght].ttf" "./fonts/test-font/variable/TestFont[opsz,wdth,wght].ttf" "./sources/designspaces/avar2OpticalSize.designspace"
./scripts/rename-fonts.py --inplace --suffix " Optical Size Avar2" "./fonts/test-font/variable/TestFontOpticalSizeAvar2[opsz,wdth,wght].ttf"

# create instances of the optical size font
# regular
fonttools varLib.instancer "./fonts/test-font/variable/TestFontOpticalSizeAvar2[opsz,wdth,wght].ttf" wght=400 wdth=100 opsz=6 -o "./fonts/test-font/TestFontOpticalSizeRegularCaption.ttf"
./scripts/rename-fonts.py --inplace --suffix " Caption" "./fonts/test-font/TestFontOpticalSizeRegularCaption.ttf"
fonttools varLib.instancer "./fonts/test-font/variable/TestFontOpticalSizeAvar2[opsz,wdth,wght].ttf" wght=400 wdth=100 opsz=16 -o "./fonts/test-font/TestFontOpticalSizeRegularText.ttf"
./scripts/rename-fonts.py --inplace --suffix " Text" "./fonts/test-font/TestFontOpticalSizeRegularText.ttf"
fonttools varLib.instancer "./fonts/test-font/variable/TestFontOpticalSizeAvar2[opsz,wdth,wght].ttf" wght=400 wdth=100 opsz=144 -o "./fonts/test-font/TestFontOpticalSizeRegularCinema.ttf"
./scripts/rename-fonts.py --inplace --suffix " Cinema" "./fonts/test-font/TestFontOpticalSizeRegularCinema.ttf"
# thin expanded
fonttools varLib.instancer "./fonts/test-font/variable/TestFontOpticalSizeAvar2[opsz,wdth,wght].ttf" wght=100 wdth=125 opsz=6 -o "./fonts/test-font/TestFontOpticalSizeThinExpandedCaption.ttf"
./scripts/rename-fonts.py --inplace --suffix " Thin Expanded Caption" "./fonts/test-font/TestFontOpticalSizeThinExpandedCaption.ttf"
fonttools varLib.instancer "./fonts/test-font/variable/TestFontOpticalSizeAvar2[opsz,wdth,wght].ttf" wght=100 wdth=125 opsz=16 -o "./fonts/test-font/TestFontOpticalSizeThinExpandedText.ttf"
./scripts/rename-fonts.py --inplace --suffix " Thin Expanded Text" "./fonts/test-font/TestFontOpticalSizeThinExpandedText.ttf"
fonttools varLib.instancer "./fonts/test-font/variable/TestFontOpticalSizeAvar2[opsz,wdth,wght].ttf" wght=100 wdth=125 opsz=144 -o "./fonts/test-font/TestFontOpticalSizeThinExpandedCinema.ttf"
./scripts/rename-fonts.py --inplace --suffix " Thin Expanded Cinema" "./fonts/test-font/TestFontOpticalSizeThinExpandedCinema.ttf"
# black condensed
fonttools varLib.instancer "./fonts/test-font/variable/TestFontOpticalSizeAvar2[opsz,wdth,wght].ttf" wght=900 wdth=75 opsz=6 -o "./fonts/test-font/TestFontOpticalSizeBlackCondensedCaption.ttf"
./scripts/rename-fonts.py --inplace --suffix " Black Condensed Caption" "./fonts/test-font/TestFontOpticalSizeBlackCondensedCaption.ttf"
fonttools varLib.instancer "./fonts/test-font/variable/TestFontOpticalSizeAvar2[opsz,wdth,wght].ttf" wght=900 wdth=75 opsz=16 -o "./fonts/test-font/TestFontOpticalSizeBlackCondensedText.ttf"
./scripts/rename-fonts.py --inplace --suffix " Black Condensed Text" "./fonts/test-font/TestFontOpticalSizeBlackCondensedText.ttf"
fonttools varLib.instancer "./fonts/test-font/variable/TestFontOpticalSizeAvar2[opsz,wdth,wght].ttf" wght=900 wdth=75 opsz=144 -o "./fonts/test-font/TestFontOpticalSizeBlackCondensedCinema.ttf"
./scripts/rename-fonts.py --inplace --suffix " Black Condensed Cinema" "./fonts/test-font/TestFontOpticalSizeBlackCondensedCinema.ttf"
