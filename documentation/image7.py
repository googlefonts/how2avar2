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
HEIGHT = 1024
MARGIN = 128
FRAMES = 1

# List of fonts to process
# Note: Ensure these fonts actually support the ZROT axis
FONT_PATHS = [
    "fonts/variable/TestFont[opsz,wdth,wght].ttf",
    "fonts/variable/LinearRotation[ZROT].ttf",
    "fonts/variable/QuadraticRotation[AAAA,BBBB,ZROT].ttf",
]
FONT_LICENSE = "OFL v1.1"
AUXILIARY_FONT = "Helvetica"
AUXILIARY_FONT_SIZE = 48

# Fixed Settings
FIXED_WDTH = 100
FIXED_WGHT = 400

# Z Rotation values to iterate through
ZROT_SPECS = [0, 30, 45, 60, 90]

GRID_VIEW = False  # Toggle this for a grid overlay

# Handel the "--output" flag
# For example: $ python3 documentation/image1.py --output documentation/image1.png
parser = argparse.ArgumentParser()
parser.add_argument("--output", metavar="PNG", help="where to write the PNG file")
args = parser.parse_args()

# Constants that are worked out dynamically
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


# Draw main text: Single line iterating Z Rotation
def draw_main_text(current_font_path):
    fill(1)
    stroke(None)
    font(current_font_path)

    # 1. Setup Layout
    count = len(ZROT_SPECS)

    # Area to draw in (inside margins)
    draw_w = WIDTH - (MARGIN * 2)

    # Column width per letter
    col_w = draw_w / count

    # Set a large font size to visualize the features clearly
    main_font_size = 280
    fontSize(main_font_size)

    # Vertical center
    y_center = HEIGHT / 2
    # Adjust for visual baseline
    y_pos = y_center - (main_font_size * 0.35)

    # 2. Loop through ZROT values
    for i, zrot_val in enumerate(ZROT_SPECS):
        # Calculate X Center
        x_pos = MARGIN + (i * col_w) + (col_w / 2)

        # Apply Variations
        # We pass ZROT as a keyword argument corresponding to the axis tag
        fontVariations(wdth=FIXED_WDTH, wght=FIXED_WGHT, ZROT=zrot_val)

        # Draw Letter
        text("H", (x_pos, y_pos), align="center")

        # Optional: Draw label below to identify the ZROT value
        with savedState():
            font(AUXILIARY_FONT)
            fontSize(24)
            fill(0.5)
            text(f"{zrot_val}°", (x_pos, y_pos - 50), align="center")


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
        # 1. Reset the drawing stack for each font to ensure singular output files
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
