# How2Avar2

This repository provides documentation, resources, and test fonts for avar2. To read more, please visit the [documentation website](https://googlefonts.github.io/how2avar2/) and the [official specification](https://github.com/harfbuzz/boring-expansion-spec/blob/main/avar2.md).

These test fonts cover the major use cases of avar2:

- Distort the design space to accurately represent the type designer’s artistic vision
- Set fences in the design space to restrict ugly zones
- Support higher order interpolation (HOI) / nonlinear interpolation (NLI)
- Blend axes together to simplify controls for end users

Information about the test fonts is included below.

## Test fonts

The variable test fonts offer comparisons between current avar1 implementations and new avar2 implementations.

### Demo files

- **TestFont[opsz,wdth,wght].ttf** The main test font that other test fonts build upon. Includes the letters `H`, `L`, and `T` across width and weight axes. The plain base example for variable fonts.
- **TestFontAvar1[opsz,wdth,wght].ttf** A default design space applied to the main test font, implemented with **avar1**.
- **TestFontAvar2[opsz,wdth,wght].ttf** The same default design space applied to the main test font, implemented with **avar2**.
- **TestFontFencesAvar2[opsz,wdth,wght].ttf** Design space fences, implemented with avar2.
- **TestFontOpticalSizeAvar2[opsz,wdth,wght].ttf** An optical size axis that manipulates the width and weight axes, implemented with avar2.

The following fonts are similar to the ones above, except the base test font is different. Instead, the Alternate Glyphs test font only has the letter `H`, which is swapped with `H.compressed` in condensed widths.

- AlternateGlyphs[opsz,wdth,wght].ttf
- AlternateGlyphsAvar1[opsz,wdth,wght].ttf
- AlternateGlyphsAvar2[opsz,wdth,wght].ttf
- AlternateGlyphsFencesAvar2[opsz,wdth,wght].ttf
- AlternateGlyphsOpticalSizeAvar2[opsz,wdth,wght].ttf

The following fonts test rotation:

- **LinearRotation[ZROT].ttf** linear rotation with the letter `H` and the `ZROT` Rotation in Z axis range between 0-90.
- **QuadraticRotation[AAAA,BBBB,ZROT].ttf** HOI/NIL quadratic rotation with the letter `H` and the `ZROT` Rotation in Z axis range between 0-90. Includes intermediate hidden axes `AAAA` and `BBBB`.

### Source files

- **TestFont.glyphspackage** The main test font that other test fonts build upon. The plain example for variable fonts.
  - Config `config-test-font.yaml`
  - 9 masters for width and weight variations
  - 3 letters `H`, `L`, and `T`
- **AlternateGlyphs.glyphspackage** A variation of the main test font made for [switching shapes](https://glyphsapp.com/learn/switching-shapes#g-2-alternate-glyphs) / alternate glyphs / glyph replacements.
  - Config `config-alternate-glyphs.yaml`
  - 9 masters for width and weight variations
  - 1 letter `H` with `H.compressed` for condensed widths
  - The `variable-font-substitutions.fea` adds the OpenType Features to switch the glyphs, since `fontMake` [does not support](https://github.com/googlefonts/fontmake/issues/951) Glyph’s [Feature Condition Syntax](https://handbook.glyphsapp.com/layout/conditional-feature-code/)
  - `AlternateGlyphsOriginal.glyphspackage` could not be used, since `fontMake` [does not support](https://github.com/googlefonts/fontmake/issues/1164) Glyph’s [corner components](https://glyphsapp.com/learn/reusing-shapes-corner-components).
- **LinearRotation.glyphspackage** A variation of the main test font
  - Config `config-linear-rotation.yaml`
  - 90 degree **linear** rotation
  - Only supports the default weight `400` and width `100`
  - 1 letter `H`
- **QuadraticRotation.glyphspackage** A variation of the main test font
  - Config `config-quadratic-rotation.yaml`
  - 90 degree **quadratic** rotation
  - Only supports the default weight `400` and width `100`
  - 1 letter `H`
  - The axis mapping is implemented with `avar2QuadraticRotation.designspace`
  - Includes intermediate hidden axes `AAAA` and `BBBB`
- **avar1.designspace** The default design space for `TestFont.glyphspackage` and `AlternateGlyphs.glyphspackage`, implemented with **avar1**
- **avar2.designspace** The same default design space for `TestFont.glyphspackage` and `AlternateGlyphs.glyphspackage`, implemented with **avar2**
- **avar2Fences.designspace** Design space fences for `TestFont.glyphspackage` and `AlternateGlyphs.glyphspackage`, implemented with avar2
- **avar2OpticalSize.designspace** An optical size axis that manipulates the width and weight axes for `TestFont.glyphspackage` and `AlternateGlyphs.glyphspackage`, implemented with avar2

### Scripts

To combine `.designspace` files with test fonts, use `fonttools varLib.avar.build`.

To fix axis bound in test fonts, use `./scripts/fix-axis-bounds.py`.

To rename fonts after making a new variation, use `./scripts/rename-fonts.py`

For examples, see the `Makefile`.
