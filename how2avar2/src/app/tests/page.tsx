import path from "node:path";
import Image from "next/image";
import { Fragment } from "react";
import { StatusBadge } from "@/components/StatusBadge";
import { PlatformIcons } from "@/components/PlatformIcons";
import { FailMessage } from "@/components/FailMessage";
import { IconKeys } from "@/components/IconKey";
import {
  getTestGroups,
  sortHtmls,
  sortPngs,
  screenshotStatusOf,
} from "@/utils/testFiles";

// cannot use Link component when linking to non-next.js files https://stackoverflow.com/a/61059425
// cannot use useRouter inside of an async function https://github.com/vercel/next.js/discussions/43924
// cannot easily reference basePath at runtime https://github.com/vercel/next.js/discussions/16059
// while unsupported, addBasePath is the best option
// - https://github.com/vercel/next.js/discussions/16047
// - https://til.dchan.cc/posts/01-22-2024/
import { addBasePath } from "next/dist/client/add-base-path.js";

export default async function TestsPage() {
  const groups = await getTestGroups();

  return (
    <div className="prose dark:prose-invert mx-auto mt-16 max-w-4xl px-8">
      <h1>Reftests</h1>

      <p>
        <a href={addBasePath("/tests/interactive/demo.html")}>
          Interactive Demo
        </a>
      </p>

      <IconKeys />

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
                  <a href={addBasePath(`/tests/static/${groupName}/${html}`)}>
                    {htmlName}
                  </a>
                  {screenshots.length > 0 && (
                    <ul>
                      {screenshots.map((png) => {
                        const pngUrl = addBasePath(
                          `/tests/static/${groupName}/${png}`,
                        );
                        const pngName = path.parse(png).name;
                        const failMd = `${pngName}.fail.md`;
                        const failMdPath = mds.includes(failMd)
                          ? `${groupName}/${failMd}`
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
