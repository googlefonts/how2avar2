# This script is meant to be run from the root level
# of your font's git repository. For example, from a Unix terminal:
# $ git clone my-font
# $ cd my-font
# $ python3 documentation/image1.py --output documentation/image1.png

# Import moduels from external python packages: https://pypi.org/
import argparse
import os

# Import moduels from the Python Standard Library: https://docs.python.org/3/library/
import subprocess
import sys

from drawbot_skia.drawbot import *
from fontTools.misc.fixedTools import floatToFixedToStr
from fontTools.ttLib import TTFont

# Constants, these are the main "settings" for the image
WIDTH = 2048
# Increased height to fit 11 rows comfortably
HEIGHT = 3000
MARGIN = 128
FRAMES = 1

# List of fonts to process
FONT_PATHS = [
    "fonts/variable/TestFontBase[opsz,wdth,wght].ttf",
    "fonts/variable/TestFontAvar1[opsz,wdth,wght].ttf",
    "fonts/variable/TestFontAvar2[opsz,wdth,wght].ttf",
    "fonts/variable/TestFontAvar2Fences[opsz,wdth,wght].ttf",
    "fonts/variable/TestFontAvar2OpticalSize[opsz,wdth,wght].ttf",
]
FONT_LICENSE = "OFL v1.1"
AUXILIARY_FONT = "Helvetica"
AUXILIARY_FONT_SIZE = 48

# Specific Axis Values
# Widths (Columns: 8 steps)
WDTH_SPECS = [50, 62.5, 75, 87.5, 100, 112.5, 125, 150]
# Weights (Rows: 11 steps)
WGHT_SPECS = [1, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000]
# Optical Sizes (Used to pick best fit for the grid size to ensure clean rendering)
OPSZ_SPECS = [6, 12, 16, 24, 48, 72, 144]

GRID_VIEW = False  # Toggle this for a grid overlay

# Handel the "--output" flag
# For example: $ python3 documentation/image1.py --output documentation/image1.png
parser = argparse.ArgumentParser()
parser.add_argument("--output", metavar="PNG", help="where to write the PNG file")
args = parser.parse_args()

# Constants that are worked out dynamically (Git info is constant for the repo)
# We use try/except to avoid crashing if not in a git repo
try:
    MY_URL = subprocess.check_output("git remote get-url origin", shell=True).decode()
    MY_HASH = subprocess.check_output("git rev-parse --short HEAD", shell=True).decode()
except:
    MY_URL = "Unknown Repo"
    MY_HASH = "Unknown Commit"


# Draws a grid
def grid():
    stroke(1, 0, 0, 0.75)
    strokeWidth(2)
    STEP_X, STEP_Y = 0, 0
    INCREMENT_X, INCREMENT_Y = MARGIN / 2, MARGIN / 2
    rect(MARGIN, MARGIN, WIDTH - (MARGIN * 2), HEIGHT - (MARGIN * 2))
    for x in range(29):
        polygon((MARGIN + STEP_X, MARGIN), (MARGIN + STEP_X, HEIGHT - MARGIN))
        STEP_X += INCREMENT_X
    for y in range(29):
        polygon((MARGIN, MARGIN + STEP_Y), (WIDTH - MARGIN, MARGIN + STEP_Y))
        STEP_Y += INCREMENT_Y
    polygon((WIDTH / 2, 0), (WIDTH / 2, HEIGHT))
    polygon((0, HEIGHT / 2), (WIDTH, HEIGHT / 2))


# Draw the page/frame and a grid if "GRID_VIEW" is set to "True"
def draw_background():
    newPage(WIDTH, HEIGHT)
    fill(0)
    rect(-2, -2, WIDTH + 2, HEIGHT + 2)
    if GRID_VIEW:
        grid()
    else:
        pass


# Draw main text in a Weight x Width grid using the current font
def draw_main_text(current_font_path):
    fill(1)
    stroke(None)
    font(current_font_path)

    # 1. Calculate Grid Dimensions
    cols = len(WDTH_SPECS)
    rows = len(WGHT_SPECS)

    # Area to draw in (inside margins)
    draw_w = WIDTH - (MARGIN * 2)
    draw_h = HEIGHT - (MARGIN * 3)  # Extra bottom margin for footer separation

    # Cell size
    cell_w = draw_w / cols
    cell_h = draw_h / rows

    # 2. Calculate Font Size
    # Fit the letter within the smaller dimension of the cell
    target_font_size = min(cell_w, cell_h) * 0.75
    fontSize(target_font_size)

    # 3. Determine Optical Size
    # Find the value in OPSZ_SPECS closest to the target_font_size
    target_opsz = min(OPSZ_SPECS, key=lambda x: abs(x - target_font_size))

    # 4. Draw the Grid
    # Y-Loop: Weights (Top to Bottom -> Light to Bold)
    for r, wght_val in enumerate(WGHT_SPECS):
        # X-Loop: Widths (Left to Right -> Narrow to Wide)
        for c, wdth_val in enumerate(WDTH_SPECS):
            # Calculate Center Position of the Cell
            # X: Start Margin + (current column * cell width) + half cell
            x_pos = MARGIN + (c * cell_w) + (cell_w / 2)

            # Y: Start Top (Height - Margin) - (current row * cell height) - half cell
            # We subtract because coordinates start at bottom-left.
            # We shift down slightly to account for the top header margin.
            y_center = (HEIGHT - (MARGIN * 1.5)) - (r * cell_h) - (cell_h / 2)

            # Adjust Y for visual baseline (move down by ~35% of font size to center the capital H)
            y_pos = y_center - (target_font_size * 0.35)

            # Apply Variations
            # We fix opsz to the best fit, while varying wdth and wght
            fontVariations(wdth=wdth_val, wght=wght_val, opsz=target_opsz)

            # Draw
            text("H", (x_pos, y_pos), align="center")


# Divider lines
def draw_divider_lines():
    stroke(1)
    strokeWidth(5)
    lineCap("round")
    line((MARGIN, HEIGHT - (MARGIN * 1.5)), (WIDTH - MARGIN, HEIGHT - (MARGIN * 1.5)))
    line((MARGIN, MARGIN + (MARGIN / 2)), (WIDTH - MARGIN, MARGIN + (MARGIN / 2)))
    stroke(None)


# Draw text describing the font and it's git status & repo URL
def draw_auxiliary_text(current_font_name, current_font_version):
    # Setup
    font(AUXILIARY_FONT)
    fontSize(AUXILIARY_FONT_SIZE)
    POS_TOP_LEFT = (MARGIN, HEIGHT - MARGIN * 1.25)
    POS_TOP_RIGHT = (WIDTH - MARGIN, HEIGHT - MARGIN * 1.25)
    POS_BOTTOM_LEFT = (MARGIN, MARGIN)
    POS_BOTTOM_RIGHT = (WIDTH - MARGIN * 0.95, MARGIN)

    URL_AND_HASH = MY_URL + "at commit " + MY_HASH
    URL_AND_HASH = URL_AND_HASH.replace("\n", " ")

    # Draw Text
    text(current_font_name, POS_TOP_LEFT, align="left")
    text(current_font_version, POS_TOP_RIGHT, align="right")
    text(URL_AND_HASH, POS_BOTTOM_LEFT, align="left")
    text(FONT_LICENSE, POS_BOTTOM_RIGHT, align="right")


# Build and save the images
if __name__ == "__main__":
    if not args.output:
        print("Error: --output argument is required.")
        sys.exit(1)

    for font_path in FONT_PATHS:
        # 1. Reset the drawing stack for each font
        newDrawing()

        print(f"DrawBot: Processing {font_path}...")

        # 2. Load Metadata
        ttFont = TTFont(font_path)
        font_name = ttFont["name"].getDebugName(4)
        font_version = "v%s" % floatToFixedToStr(ttFont["head"].fontRevision, 16)

        # 3. Draw Content
        draw_background()
        draw_main_text(font_path)
        draw_divider_lines()
        draw_auxiliary_text(font_name, font_version)

        # 4. Determine unique output filename
        # E.g. documentation/image1.png -> documentation/image1-TestFontBase.png
        dir_name, full_filename = os.path.split(args.output)
        file_root, file_ext = os.path.splitext(full_filename)

        # Extract clean font name (remove path and axes info)
        font_file = os.path.basename(font_path)
        font_clean_name = os.path.splitext(font_file)[0].split("[")[0]

        new_filename = f"{file_root}-{font_clean_name}{file_ext}"
        output_path = os.path.join(dir_name, new_filename)

        # 5. Save output
        saveImage(output_path)
        print(f"DrawBot: Saved {output_path}")

    print("DrawBot: Done")
