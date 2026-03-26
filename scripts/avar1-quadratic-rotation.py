#!/usr/bin/env python3

"""Script to modify the 'QuadraticRotation[AAAA,BBBB,ZROT].ttf' variable font for avar1 quadratic rotation."""

import io
import sys

from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

# Linear interpolation interpolates a single axis at a time
# HOI (higher order interpolation) interpolates multiple axes at the same

# example implementations
# - in avar2, one axis can control multiple other axes in tandem
# - in avar1, axes with the same name will interpolate together

HOI_AXIS = "ZROT"
RENAME_AXES = ["AAAA", "BBBB"]


def main():
    font = TTFont(
        "fonts/quadratic-rotation/variable/QuadraticRotation[AAAA,BBBB,ZROT].ttf"
    )

    fvar = font["fvar"]
    zrot_axis = next((a for a in fvar.axes if a.axisTag == HOI_AXIS), None)
    if not zrot_axis:
        print(f"Axis {HOI_AXIS} not found in fvar. Exiting.")
        sys.exit(1)

    name_id = zrot_axis.axisNameID

    # drop HOI_AXIS from all tables
    instantiateVariableFont(font, axisLimits={HOI_AXIS: 0}, inplace=True)

    # fonttools cannot handle two axes with the same name in the gvar table
    # after all, in python, dictionaries must have a unique string key
    # reload (serialize and deserialize) the font to avoid gvar decompilation
    # rename the tags using the fvar table instead
    buffer = io.BytesIO()
    font.save(buffer)
    buffer.seek(0)

    font2 = TTFont(buffer)

    print(f"Renaming {RENAME_AXES} tags to match {HOI_AXIS} (nameID {name_id})")
    fvar = font2["fvar"]
    for axis in fvar.axes:
        if axis.axisTag in RENAME_AXES:
            axis.axisNameID = name_id
            axis.axisTag = HOI_AXIS

    # clean up STAT table DesignAxisRecord
    if "STAT" in font2:
        stat = font2["STAT"].table
        if hasattr(stat, "DesignAxisRecord"):
            records = stat.DesignAxisRecord.Axis
            new_records = []
            for record in records:
                if record.AxisTag in RENAME_AXES:
                    record.AxisTag = HOI_AXIS
                new_records.append(record)
            stat.DesignAxisRecord.Axis = new_records
            stat.DesignAxisRecord.DesignAxisCount = len(new_records)

    # rename keys in fvar table
    for instance in fvar.instances:
        new_coords = {}
        for old_axis, value in instance.coordinates.items():
            if old_axis in RENAME_AXES:
                # safely set identical values for shared axis names
                new_coords[HOI_AXIS] = value
            else:
                new_coords[old_axis] = value
        instance.coordinates = new_coords

    font2.save("fonts/quadratic-rotation/variable/QuadraticRotationAvar1[ZROT].ttf")


if __name__ == "__main__":
    main()
