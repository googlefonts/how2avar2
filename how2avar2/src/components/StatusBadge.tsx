import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faXmark,
  faEquals,
  faNotEqual,
  faLayerGroup,
} from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

export const statuses = [
  "passed",
  "failed",
  "expected",
  "expected-mismatch",
  "composited",
] as const;
export type Status = (typeof statuses)[number];

export const statusConfig: Record<
  Status,
  { bg: string; text: string; icon: IconDefinition; label: string }
> = {
  passed: {
    bg: "bg-emerald-100",
    text: "text-emerald-900",
    icon: faCheck,
    label: "Passed",
  },
  failed: {
    bg: "bg-rose-100",
    text: "text-rose-900",
    icon: faXmark,
    label: "Failed",
  },
  expected: {
    bg: "bg-blue-100",
    text: "text-blue-900",
    icon: faEquals,
    label: "Expected",
  },
  "expected-mismatch": {
    bg: "bg-violet-100",
    text: "text-violet-900",
    icon: faNotEqual,
    label: "Expected Mismatch",
  },
  composited: {
    bg: "bg-gray-100",
    text: "text-gray-900",
    icon: faLayerGroup,
    label: "Composited",
  },
};

export function StatusBadgeKey({ status }: { status: Status }) {
  const { bg, text, icon, label } = statusConfig[status];
  return (
    <span
      className={`flex items-center gap-1.5 rounded px-2 py-1 text-sm ${bg} ${text}`}
    >
      <FontAwesomeIcon icon={icon} className="size-4" />
      {label}
    </span>
  );
}

export function StatusBadge({ status }: { status: Status }) {
  const { bg, text, icon } = statusConfig[status];
  return (
    <span
      className={`flex shrink-0 items-center justify-center p-2 ${bg} ${text}`}
    >
      <FontAwesomeIcon icon={icon} className="size-4" />
    </span>
  );
}
