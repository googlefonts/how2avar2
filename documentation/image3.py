# This script is meant to be run from the root level
# of your font's git repository. For example, from a Unix terminal:
# $ git clone my-font
# $ cd my-font
# $ python3 documentation/image1.py --output documentation/image1.png

# Import moduels from external python packages: https://pypi.org/
import argparse

# Import moduels from the Python Standard Library: https://docs.python.org/3/library/
import subprocess

from drawbot_skia.drawbot import *
from fontTools.misc.fixedTools import floatToFixedToStr
from fontTools.ttLib import TTFont

# Constants, these are the main "settings" for the image
WIDTH = 2048
# Increased height to fit 11 rows comfortably
HEIGHT = 3000
MARGIN = 128
FRAMES = 1

FONT_PATH = "fonts/variable/TestFontBase[opsz,wdth,wght].ttf"
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

# Load the font with the parts of fonttools that are imported with the line:
# from fontTools.ttLib import TTFont
# Docs Link: https://fonttools.readthedocs.io/en/latest/ttLib/ttFont.html
ttFont = TTFont(FONT_PATH)

# Constants that are worked out dynamically
MY_URL = subprocess.check_output("git remote get-url origin", shell=True).decode()
MY_HASH = subprocess.check_output("git rev-parse --short HEAD", shell=True).decode()
FONT_NAME = ttFont["name"].getDebugName(4)
FONT_VERSION = "v%s" % floatToFixedToStr(ttFont["head"].fontRevision, 16)


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


# Draw main text in a Weight x Width grid
def draw_main_text():
    fill(1)
    stroke(None)
    font(FONT_PATH)

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
def draw_auxiliary_text():
    # Setup
    font(AUXILIARY_FONT)
    fontSize(AUXILIARY_FONT_SIZE)
    POS_TOP_LEFT = (MARGIN, HEIGHT - MARGIN * 1.25)
    POS_TOP_RIGHT = (WIDTH - MARGIN, HEIGHT - MARGIN * 1.25)
    POS_BOTTOM_LEFT = (MARGIN, MARGIN)
    POS_BOTTOM_RIGHT = (WIDTH - MARGIN * 0.95, MARGIN)
    # URL_AND_HASH = "github.com/googlefonts/googlefonts-project-template " + "at commit " + MY_HASH
    URL_AND_HASH = MY_URL + "at commit " + MY_HASH
    URL_AND_HASH = URL_AND_HASH.replace("\n", " ")
    # Draw Text
    # text("Your Font Regular", POS_TOP_LEFT, align="left")
    text(FONT_NAME, POS_TOP_LEFT, align="left")
    text(FONT_VERSION, POS_TOP_RIGHT, align="right")
    text(URL_AND_HASH, POS_BOTTOM_LEFT, align="left")
    text(FONT_LICENSE, POS_BOTTOM_RIGHT, align="right")


# Build and save the image
if __name__ == "__main__":
    draw_background()
    draw_main_text()
    draw_divider_lines()
    draw_auxiliary_text()
    # Save output, using the "--output" flag location
    saveImage(args.output)
    # Print done in the terminal
    print("DrawBot: Done")
