#!/usr/bin/env bash
# [MISE] description="Generate font images"
# [MISE] depends=["fonts.build"]
# [MISE] sources=["fonts/**/*", "documentation/*.py"]
# [MISE] outputs=["documentation/*.png"]
# [USAGE] arg "[image-stem]" help="Image filename stem"

set -euo pipefail

image_stem="${usage_image_stem:-}"

if [[ -n "$image_stem" ]]; then
    # Remove leading folder
    image_stem="${image_stem#./documentation/}"
    image_stem="${image_stem#documentation/}"
    # Remove trailing extension
    image_stem="${image_stem%.py}"
    image_stem="${image_stem%.png}"

    python3 "documentation/$image_stem.py" --output "documentation/$image_stem.png"
else
    while IFS= read -r -d '' file; do
        python3 "$file" --output "${file%.py}.png"
    done < <(find "./documentation" -type f -name '*.py' -print0)
fi
