import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faApple,
  faWindows,
  faLinux,
  faSafari,
  faChrome,
  faFirefox,
} from "@fortawesome/free-brands-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

const osIcons: Record<string, IconDefinition> = {
  mac: faApple,
  win: faWindows,
  linux: faLinux,
};

const browserIcons: Record<string, IconDefinition> = {
  safari: faSafari,
  chrome: faChrome,
  firefox: faFirefox,
};

export function PlatformIcons({
  os,
  browser,
}: {
  os: string;
  browser: string;
}) {
  const osIcon = osIcons[os];
  const browserIcon = browserIcons[browser];

  return (
    <span className="flex shrink-0 flex-col items-center justify-around p-2 bg-gray-100 text-gray-600">
      {osIcon && <FontAwesomeIcon icon={osIcon} className="size-4" />}
      {browserIcon && <FontAwesomeIcon icon={browserIcon} className="size-4" />}
    </span>
  );
}
