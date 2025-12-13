#!/usr/bin/env python3

"""Script to update the specific axis bounds in the input font's `fvar` table.

Search for the specific axis tag (e.g. 'opsz') and update the
minimum and maximum values. Automatically clamp the default value if it
falls outside the range.
"""

import argparse
import logging

from fontTools.misc.cliTools import makeOutputFileName
from fontTools.ttLib import TTFont

logger = logging.getLogger()


def update_axis_bounds(
    font, axis_tag, new_minValue, new_maxValue, new_defaultValue=None
):
    """Find the axis and update its min, max, and default values."""

    if "fvar" not in font:
        logger.warning("  Skipping: No 'fvar' table found.")
        return False

    fvar = font["fvar"]

    # Find the axis by tag
    axis = next((axis for axis in fvar.axes if axis.axisTag == axis_tag), None)

    if axis is None:
        logger.warning("  Skipping: No '%s' axis found in fvar.", axis_tag)
        return False

    old_minValue = axis.minValue
    old_maxValue = axis.maxValue
    old_defaultValue = axis.defaultValue

    # Update values
    axis.minValue = new_minValue
    axis.maxValue = new_maxValue

    # Handle default value
    if new_defaultValue is not None:
        axis.defaultValue = new_defaultValue
    else:
        # Clamp existing default to be within new bounds
        if axis.defaultValue < new_minValue:
            axis.defaultValue = new_minValue
            logger.info("    Clamped default value up to %s", new_minValue)
        elif axis.defaultValue > new_maxValue:
            axis.defaultValue = new_maxValue
            logger.info("    Clamped default value down to %s", new_maxValue)

    logger.info(
        "    Updated %s: [%s:%s:%s] -> [%s:%s:%s]",
        axis_tag,
        old_minValue,
        old_defaultValue,
        old_maxValue,
        axis.minValue,
        axis.defaultValue,
        axis.maxValue,
    )
    return True


def main(args=None):
    parser = argparse.ArgumentParser(
        description=__doc__,
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )

    # axis args
    parser.add_argument("--axis", required=True, help="The axis tag (e.g. 'opsz')")
    parser.add_argument(
        "--min", type=float, required=True, help="New minimum axis value"
    )
    parser.add_argument(
        "--max", type=float, required=True, help="New maximum axis value"
    )
    parser.add_argument(
        "--default", type=float, help="New default axis value (optional)"
    )

    # file args
    parser.add_argument("input_fonts", metavar="FONTFILE", nargs="+")
    output_group = parser.add_mutually_exclusive_group()
    output_group.add_argument(
        "-i", "--inplace", action="store_true", help="Overwrite input file"
    )
    output_group.add_argument(
        "-d", "--output-dir", help="Write output to this directory"
    )
    output_group.add_argument(
        "-o", "--output-file", help="Write output to this specific filename"
    )

    parser.add_argument("-v", "--verbose", action="count", default=0)

    options = parser.parse_args(args)

    if not options.verbose:
        level = "WARNING"
    elif options.verbose == 1:
        level = "INFO"
    else:
        level = "DEBUG"
    logging.basicConfig(level=level, format="%(message)s")

    if options.output_file and len(options.input_fonts) > 1:
        parser.error("argument -o/--output-file can't be used with multiple inputs")

    for input_name in options.input_fonts:
        logger.info("Processing font: '%s'", input_name)

        try:
            font = TTFont(input_name)

            modified = update_axis_bounds(
                font, options.axis, options.min, options.max, options.default
            )

            if modified:
                if options.inplace:
                    output_name = input_name
                elif options.output_file:
                    output_name = options.output_file
                else:
                    output_name = makeOutputFileName(input_name, options.output_dir)

                font.save(output_name)
                logger.info("  Saved font: '%s'", output_name)
            else:
                logger.info("  No changes made to '%s'", input_name)

            font.close()

        except Exception as e:
            logger.error("  Error processing '%s': %s", input_name, e)

    logger.info("Done!")


if __name__ == "__main__":
    main()
