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

build:
	mise fonts.build

venv:
	mise fonts.setup

customize: venv
	python3 scripts/customize.py

test: build
	which fontspector || (echo "fontspector not found. Please install it with 'cargo install fontspector'." && exit 1)
	TOCHECK=$$(find fonts/*/variable -type f 2>/dev/null); if [ -z "$$TOCHECK" ]; then TOCHECK=$$(find fonts/*/ttf -type f 2>/dev/null); fi ; mkdir -p out/ out/fontspector; fontspector --profile googlefonts -l warn --full-lists --succinct --html out/fontspector/fontspector-report.html --ghmarkdown out/fontspector/fontspector-report.md --badges out/badges $$TOCHECK  || echo '::warning file=sources/config.yaml,title=fontspector failures::The fontspector QA check reported errors in your font. Please check the generated report.'

proof: build
	TOCHECK=$$(find fonts/*/variable -type f 2>/dev/null); if [ -z "$$TOCHECK" ]; then TOCHECK=$$(find fonts/*/ttf -type f 2>/dev/null); fi ; mkdir -p out/ out/proof; diffenator2 proof $$TOCHECK -o out/proof

images:
	mise fonts.images

%.png:
	mise run fonts.images $@

clean:
	mise python.clean

update-project-template:
	npx update-template https://github.com/googlefonts/googlefonts-project-template/

update: venv
	mise uv-check-updates.update
