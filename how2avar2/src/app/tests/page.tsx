import path from "node:path";
import Link from "next/link";
import Image from "next/image";
import { Fragment } from "react";
import { StatusBadge, StatusBadgeKey } from "@/components/StatusBadge";
import { PlatformIcons, PlatformIconKey } from "@/components/PlatformIcons";
import { FailMessage } from "@/components/FailMessage";
import { statuses } from "@/utils/statuses";
import { osPlatforms, browserPlatforms } from "@/utils/platforms";
import {
  getTestGroups,
  sortHtmls,
  sortPngs,
  screenshotStatusOf,
  testsDirectory,
} from "@/utils/testFiles";

export default async function TestsPage() {
  const groups = await getTestGroups();

  return (
    <div className="prose dark:prose-invert mx-auto mt-16 max-w-4xl px-8">
      <h1>Reftests</h1>

      <p>
        <Link href="/tests/interactive/demo.html">Interactive Demo</Link>
      </p>

      <div className="not-prose mb-6 flex flex-wrap gap-3">
        <p>Statuses</p>
        {statuses.map((status) => (
          <StatusBadgeKey key={status} status={status} />
        ))}
      </div>

      <div className="not-prose mb-6 flex flex-wrap gap-3">
        <p>Operating Systems</p>
        {osPlatforms.map((platform) => (
          <PlatformIconKey key={platform} platform={platform} />
        ))}
      </div>

      <div className="not-prose mb-6 flex flex-wrap gap-3">
        <p>Browsers</p>
        {browserPlatforms.map((platform) => (
          <PlatformIconKey key={platform} platform={platform} />
        ))}
      </div>

      {groups.map(([groupName, { htmls, pngs, mds }]) => (
        <Fragment key={groupName}>
          <h2>{groupName}</h2>
          <ul>
            {sortHtmls(htmls).map((html) => {
              const htmlName = path.parse(html).name;
              const screenshots = sortPngs(
                pngs.filter((png) => png.includes(htmlName)),
              );

              return (
                <li key={html}>
                  <Link href={`/tests/static/${groupName}/${html}`}>
                    {htmlName}
                  </Link>
                  {screenshots.length > 0 && (
                    <ul>
                      {screenshots.map((png) => {
                        const pngUrl = `/how2avar2/tests/static/${groupName}/${png}`;
                        const pngName = path.parse(png).name;
                        const failMd = `${pngName}.fail.md`;
                        const failMdPath = mds.includes(failMd)
                          ? path.join(testsDirectory, groupName, failMd)
                          : null;
                        const status = screenshotStatusOf(pngName, failMdPath);
                        const [os, browser] = png.split(".");

                        return (
                          <li key={png}>
                            <div className="mt-2 mb-6">
                              <div className="not-prose grid grid-cols-[auto_auto_1fr] overflow-clip rounded border bg-white shadow-sm">
                                <StatusBadge status={status} />
                                <PlatformIcons os={os} browser={browser} />
                                <a href={pngUrl} className="pl-9">
                                  <Image
                                    src={pngUrl}
                                    alt={png}
                                    width={1440}
                                    height={400}
                                    unoptimized
                                    className="block w-full h-auto"
                                  />
                                </a>
                              </div>
                              {failMdPath && (
                                <FailMessage filePath={failMdPath} />
                              )}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </Fragment>
      ))}
    </div>
  );
}
