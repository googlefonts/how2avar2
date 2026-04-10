#!/usr/bin/env python3

import concurrent.futures
import sys
from collections import defaultdict
from pathlib import Path

from PIL import Image


def generate_composite(
    parent_dir: Path, base_test_name: str, files: list[Path], root_dir: Path
) -> None:
    if len(files) != 3:
        print(
            f"skipping {base_test_name}: expected 3 files, got {len(files)}",
            file=sys.stderr,
        )
        return

    images = [Image.open(file).convert("RGB") for file in files]
    composite = images[0]
    for image in images[1:]:
        composite = Image.blend(composite, image, alpha=0.33)

    output_path = parent_dir / f"composited.{base_test_name}"
    composite.save(output_path)
    print(output_path.relative_to(root_dir))


def main() -> None:
    root_dir = Path(__file__).resolve().parent.parent / "tests" / "static"

    if not root_dir.exists():
        print(f"error: directory not found: {root_dir}", file=sys.stderr)
        sys.exit(1)

    groups: defaultdict[tuple[Path, str], list[Path]] = defaultdict(list)
    for png in root_dir.rglob("*.png"):
        if png.name.startswith("composited."):
            continue
        parts = png.name.split(".")
        if len(parts) >= 4:
            base_test_name = ".".join(parts[2:])
            groups[png.parent, base_test_name].append(png)

    with concurrent.futures.ProcessPoolExecutor() as executor:
        futures = [
            executor.submit(generate_composite, parent, name, files, root_dir)
            for (parent, name), files in groups.items()
        ]
        for future in concurrent.futures.as_completed(futures):
            future.result()


if __name__ == "__main__":
    main()
