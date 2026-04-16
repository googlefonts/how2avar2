import path from "node:path";
import Image from "next/image";
import { Fragment } from "react";
import { StatusBadge } from "@/components/StatusBadge";
import { PlatformIcons } from "@/components/PlatformIcons";
import { FailMessage } from "@/components/FailMessage";
import { DisclosureLink } from "@/components/DisclosureLink";
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
import titleize from "titleize";
import { TestsToc, type TocGroup } from "@/components/TestsToc";

function groupLabel(groupName: string) {
  return titleize(groupName.replace(/-/g, " "));
}

export default async function TestsPage() {
  const groups = await getTestGroups();

  const tocGroups: TocGroup[] = groups.map(([groupName, { htmls }]) => ({
    id: groupName,
    label: groupLabel(groupName),
    htmlNames: sortHtmls(htmls).map((html) => path.parse(html).name),
  }));

  return (
    <div className="mx-auto flex max-w-6xl gap-8 px-8">
      <div className="prose dark:prose-invert mt-16 min-w-0 flex-1">
        <h1>Reftests</h1>

        <p>
          <a href={addBasePath("/tests/interactive/demo.html")}>
            Interactive Demo
          </a>
        </p>

        <IconKeys />

        {groups.map(([groupName, { htmls, pngs, mds }]) => (
          <Fragment key={groupName}>
            <h2 id={groupName} className="scroll-mt-12">{groupLabel(groupName)}</h2>
            <ul>
              {sortHtmls(htmls).map((html) => {
                const htmlName = path.parse(html).name;
                const screenshots = sortPngs(
                  pngs.filter((png) => png.includes(htmlName)),
                );

                const defaultOpen = !htmlName.includes("expected");

                return (
                  <li key={html} id={`${groupName}-${htmlName}`} className="scroll-mt-12">
                    <div className="flex items-start gap-1">
                      <DisclosureLink
                        href={addBasePath(`/tests/static/${groupName}/${html}`)}
                        label={`Open ${htmlName}`}
                      />
                      <details id={`details-${groupName}-${htmlName}`} open={defaultOpen}>
                      <summary className="cursor-pointer">
                        {htmlName}
                      </summary>
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
                    </details>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Fragment>
        ))}
      </div>

      <aside className="hidden lg:block w-56 shrink-0">
        <TestsToc groups={tocGroups} />
      </aside>
    </div>
  );
}
