# SOURCES=$(shell python3 scripts/read-config.py --sources )
# FAMILY=$(shell python3 scripts/read-config.py --family )
DRAWBOT_SCRIPTS=$(shell ls documentation/*.py)
DRAWBOT_OUTPUT=$(shell ls documentation/*.py | sed 's/\.py/.png/g')

help:
	@echo "###"
	@echo "# Build targets"
	@echo "###"
	@echo
	@echo "  make build:  Builds the fonts and places them in the fonts/ directory"
	@echo "  make test:   Tests the fonts with fontspector"
	@echo "  make proof:  Creates HTML proof documents in the proof/ directory"
	@echo "  make images: Creates PNG specimen images in the documentation/ directory"
	@echo

build: build.stamp
	# opentype mappings https://learn.microsoft.com/en-us/typography/opentype/spec/os2#usweightclass

	# fix opsz axis
	./scripts/fix-axis-bounds.py --inplace --axis opsz --min 6 --max 144 "fonts/variable/TestFont[opsz,wdth,wght].ttf"
	./scripts/fix-axis-bounds.py --inplace --axis ZROT --min 0 --max 90 "fonts/variable/TestFontQuadraticRotation[AAAA,BBBB,ZROT].ttf"

	# rename Test Font => Test Font Base
	cp "./fonts/variable/TestFont[opsz,wdth,wght].ttf" "./fonts/variable/TestFontBase[opsz,wdth,wght].ttf"
	./scripts/rename-fonts.py --inplace --suffix " Base" "./fonts/variable/TestFontBase[opsz,wdth,wght].ttf"

	# create Avar1 demo with axis mappings
	fonttools varLib.avar.build -o "./fonts/variable/TestFontAvar1[opsz,wdth,wght].ttf" "./fonts/variable/TestFont[opsz,wdth,wght].ttf" "./sources/avar1.designspace"
	./scripts/rename-fonts.py --inplace --suffix " Avar1" "./fonts/variable/TestFontAvar1[opsz,wdth,wght].ttf"

	# create Avar2 demo with axis mappings
	fonttools varLib.avar.build -o "./fonts/variable/TestFontAvar2[opsz,wdth,wght].ttf" "./fonts/variable/TestFont[opsz,wdth,wght].ttf" "./sources/avar2.designspace"
	./scripts/rename-fonts.py --inplace --suffix " Avar2" "./fonts/variable/TestFontAvar2[opsz,wdth,wght].ttf"

	# create Avar2 demo with fences
	fonttools varLib.avar.build -o "./fonts/variable/TestFontFencesAvar2[opsz,wdth,wght].ttf" "./fonts/variable/TestFont[opsz,wdth,wght].ttf" "./sources/avar2Fences.designspace"
	./scripts/rename-fonts.py --inplace --suffix " Fences Avar2" "./fonts/variable/TestFontFencesAvar2[opsz,wdth,wght].ttf"

	# create Avar2 demo with optical size
	fonttools varLib.avar.build -o "./fonts/variable/TestFontOpticalSizeAvar2[opsz,wdth,wght].ttf" "./fonts/variable/TestFont[opsz,wdth,wght].ttf" "./sources/avar2OpticalSize.designspace"
	./scripts/rename-fonts.py --inplace --suffix " Optical Size Avar2" "./fonts/variable/TestFontOpticalSizeAvar2[opsz,wdth,wght].ttf"

	# create Avar2 demo with quadratic rotation
	fonttools varLib.avar.build -o "./fonts/variable/TestFontQuadraticRotationAvar2[AAAA,BBBB,ZROT].ttf" "./fonts/variable/TestFontQuadraticRotation[AAAA,BBBB,ZROT].ttf" "./sources/avar2QuadraticRotation.designspace"
	./scripts/rename-fonts.py --inplace --suffix " Avar2" "./fonts/variable/TestFontQuadraticRotationAvar2[AAAA,BBBB,ZROT].ttf"

	# decompile fonts for testing
	rm -rf "ttx"
	mkdir "ttx"
	ttx -d "ttx" "fonts/variable/TestFontBase[opsz,wdth,wght].ttf"
	ttx -d "ttx" "fonts/variable/TestFontAvar1[opsz,wdth,wght].ttf"
	ttx -d "ttx" "fonts/variable/TestFontAvar2[opsz,wdth,wght].ttf"
	ttx -d "ttx" "fonts/variable/TestFontFencesAvar2[opsz,wdth,wght].ttf"
	ttx -d "ttx" "fonts/variable/TestFontOpticalSizeAvar2[opsz,wdth,wght].ttf"
	ttx -d "ttx" "fonts/variable/TestFontLinearRotation[ZROT].ttf"
	ttx -d "ttx" "fonts/variable/TestFontQuadraticRotationAvar2[AAAA,BBBB,ZROT].ttf"

	# cleanup intermediate files
	rm fonts/variable/TestFont[opsz,wdth,wght].ttf
	rm fonts/variable/TestFontQuadraticRotation[AAAA,BBBB,ZROT].ttf

venv: venv/touchfile

customize: venv
	. venv/bin/activate; python3 scripts/customize.py

build.stamp: venv
	rm -rf fonts
	(for config in sources/config*.yaml; do . venv/bin/activate; gftools builder $$config; done)  && touch build.stamp

venv/touchfile: requirements.txt
	test -d venv || python3 -m venv venv
	. venv/bin/activate; pip install -Ur requirements.txt
	touch venv/touchfile

test: build.stamp
	which fontspector || (echo "fontspector not found. Please install it with 'cargo install fontspector'." && exit 1)
	TOCHECK=$$(find fonts/variable -type f 2>/dev/null); if [ -z "$$TOCHECK" ]; then TOCHECK=$$(find fonts/ttf -type f 2>/dev/null); fi ; mkdir -p out/ out/fontspector; fontspector --profile googlefonts -l warn --full-lists --succinct --html out/fontspector/fontspector-report.html --ghmarkdown out/fontspector/fontspector-report.md --badges out/badges $$TOCHECK  || echo '::warning file=sources/config.yaml,title=fontspector failures::The fontspector QA check reported errors in your font. Please check the generated report.'

proof: venv build.stamp build
	TOCHECK=$$(find fonts/variable -type f 2>/dev/null); if [ -z "$$TOCHECK" ]; then TOCHECK=$$(find fonts/ttf -type f 2>/dev/null); fi ; . venv/bin/activate; mkdir -p out/ out/proof; diffenator2 proof $$TOCHECK -o out/proof

images: venv $(DRAWBOT_OUTPUT)

%.png: %.py build.stamp
	. venv/bin/activate; python3 $< --output $@

clean:
	rm -rf venv
	find . -name "*.pyc" -delete

update-project-template:
	npx update-template https://github.com/googlefonts/googlefonts-project-template/

update: venv
	venv/bin/pip install --upgrade pip-tools
	# See https://pip-tools.readthedocs.io/en/latest/#a-note-on-resolvers for
	# the `--resolver` flag below.
	venv/bin/pip-compile --upgrade --verbose --resolver=backtracking requirements.in
	venv/bin/pip-sync requirements.txt

	git commit -m "Update requirements" requirements.txt
	git push
