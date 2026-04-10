export const statuses = [
  "passed",
  "failed",
  "expected",
  "expected-mismatch",
  "composited",
] as const;

export type Status = (typeof statuses)[number];
