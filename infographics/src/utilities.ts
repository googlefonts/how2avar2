import getRange from "get-range";

export const interpolatedMasters = [0, 3, 6, 21, 24, 27, 42, 45, 48];

export function getAxis(start: number, end: number, instances = 7): number[] {
  instances--;

  return [
    ...getRange({
      start,
      end,
      step: Math.floor((end - start) / instances),
    }),
  ];
}
