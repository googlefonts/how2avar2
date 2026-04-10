"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faApple,
  faWindows,
  // faLinux,
  faSafari,
  faChrome,
  // faFirefox,
} from "@fortawesome/free-brands-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

type PlatformConfig = { icon: IconDefinition; label: string };

const platformConfig: Record<string, PlatformConfig> = {
  mac: { icon: faApple, label: "macOS" },
  win: { icon: faWindows, label: "Windows" },
  // linux: { icon: faLinux, label: "Linux" },
  safari: { icon: faSafari, label: "Safari" },
  chrome: { icon: faChrome, label: "Chrome" },
  // firefox: { icon: faFirefox, label: "Firefox" },
};

export const osPlatforms = ["mac", "win" /* , "linux" */] as const;
export const browserPlatforms = ["safari", "chrome" /* , "firefox" */] as const;

export function PlatformIconKey({ platform }: { platform: string }) {
  const { icon, label } = platformConfig[platform];
  return (
    <span className="flex items-center gap-1.5 rounded px-2 py-1 text-sm bg-gray-100 text-gray-600">
      <FontAwesomeIcon icon={icon} className="size-3.5" />
      {label}
    </span>
  );
}

export function PlatformIcons({
  os,
  browser,
}: {
  os?: string;
  browser?: string;
}) {
  const osConfig = os ? platformConfig[os] : undefined;
  const browserConfig = browser ? platformConfig[browser] : undefined;
  return (
    <span className="flex shrink-0 flex-col items-center justify-around p-2 bg-gray-100 text-gray-600">
      {osConfig ? (
        <FontAwesomeIcon
          icon={osConfig.icon}
          title={osConfig.label}
          className="size-4"
        />
      ) : (
        <span className="size-5" />
      )}
      {browserConfig ? (
        <FontAwesomeIcon
          icon={browserConfig.icon}
          title={browserConfig.label}
          className="size-4"
        />
      ) : (
        <span className="size-5" />
      )}
    </span>
  );
}
