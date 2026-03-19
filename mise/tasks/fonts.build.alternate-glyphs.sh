#!/usr/bin/env bash
# [MISE] depends=["fonts.setup"]
# [MISE] sources=["scripts/fix-axis-bounds.py", "scripts/rename-fonts.py", "sources/alternate-glyphs/config*.yaml", "sources/alternate-glyphs/*.glyphspackage", "sources/alternate-glyphs/*.fea", "sources/designspaces/*.designspace"]
# [MISE] outputs=["fonts/alternate-glyphs/**/*"]

set -euo pipefail

rm -rf ./fonts/alternate-glyphs

# build base font
gftools builder ./sources/alternate-glyphs/config-alternate-glyphs.yaml

# opentype mappings https://learn.microsoft.com/en-us/typography/opentype/spec/os2#usweightclass

# fix opentype features
fonttools feaLib "./sources/alternate-glyphs/variable-font-substitutions.fea" "./fonts/alternate-glyphs/variable/AlternateGlyphs[opsz,wdth,wght].ttf" -o "./fonts/alternate-glyphs/variable/AlternateGlyphs[opsz,wdth,wght].ttf"

# fix opsz axis
./scripts/fix-axis-bounds.py --inplace --axis opsz --min 6 --max 144 "./fonts/alternate-glyphs/variable/AlternateGlyphs[opsz,wdth,wght].ttf"

# create Avar1 demo with axis mappings
fonttools varLib.avar.build -o "./fonts/alternate-glyphs/variable/AlternateGlyphsAvar1[opsz,wdth,wght].ttf" "./fonts/alternate-glyphs/variable/AlternateGlyphs[opsz,wdth,wght].ttf" "./sources/designspaces/avar1.designspace"
./scripts/rename-fonts.py --inplace --suffix " Avar1" "./fonts/alternate-glyphs/variable/AlternateGlyphsAvar1[opsz,wdth,wght].ttf"

# create Avar2 demo with axis mappings
fonttools varLib.avar.build -o "./fonts/alternate-glyphs/variable/AlternateGlyphsAvar2[opsz,wdth,wght].ttf" "./fonts/alternate-glyphs/variable/AlternateGlyphs[opsz,wdth,wght].ttf" "./sources/designspaces/avar2.designspace"
./scripts/rename-fonts.py --inplace --suffix " Avar2" "./fonts/alternate-glyphs/variable/AlternateGlyphsAvar2[opsz,wdth,wght].ttf"

# create Avar2 demo with fences
fonttools varLib.avar.build -o "./fonts/alternate-glyphs/variable/AlternateGlyphsFencesAvar2[opsz,wdth,wght].ttf" "./fonts/alternate-glyphs/variable/AlternateGlyphs[opsz,wdth,wght].ttf" "./sources/designspaces/avar2Fences.designspace"
./scripts/rename-fonts.py --inplace --suffix " Fences Avar2" "./fonts/alternate-glyphs/variable/AlternateGlyphsFencesAvar2[opsz,wdth,wght].ttf"

# create Avar2 demo with optical size
fonttools varLib.avar.build -o "./fonts/alternate-glyphs/variable/AlternateGlyphsOpticalSizeAvar2[opsz,wdth,wght].ttf" "./fonts/alternate-glyphs/variable/AlternateGlyphs[opsz,wdth,wght].ttf" "./sources/designspaces/avar2OpticalSize.designspace"
./scripts/rename-fonts.py --inplace --suffix " Optical Size Avar2" "./fonts/alternate-glyphs/variable/AlternateGlyphsOpticalSizeAvar2[opsz,wdth,wght].ttf"
