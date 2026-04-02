import { glob } from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
import Image from "next/image";
import titleize from "titleize";
import sortOn from "sort-on";
import { Fragment } from "react";

export default async function TestsPage() {
  const interactiveDemo = "interactive/demo.html";
  const cwd = path.resolve("public/tests/static");

  const allFiles = await Array.fromAsync(glob("**/*.{html,png}", { cwd }));

  const groups = sortOn(
    Object.entries(
      allFiles.reduce<Record<string, { htmls: string[]; pngs: string[] }>>(
        (accumulator, file) => {
          const [groupName, fileName] = file.split("/");
          accumulator[groupName] ??= { htmls: [], pngs: [] };
          const fileType = fileName.endsWith(".html") ? "htmls" : "pngs";
          accumulator[groupName][fileType].push(fileName);
          return accumulator;
        },
        {},
      ),
    ),
    [([groupName]) => groupName],
  );

  return (
    <div className="prose dark:prose-invert mx-auto mt-16 max-w-lg px-8">
      <h1>Reftests</h1>

      {interactiveDemo && (
        <p>
          <Link href={`/tests/${interactiveDemo}`}>Interactive Demo</Link>
        </p>
      )}

      {groups.map(([groupName, { htmls, pngs }]) => (
        <Fragment key={groupName}>
          <h2>{groupName}</h2>
          <ul>
            {sortOn(htmls, [
              (name) => {
                if (name.includes("mismatch")) return 2;
                if (name.includes("expected")) return 1;
                return 0;
              },
              (name) => name,
            ]).map((html) => {
              const htmlName = path.parse(html).name;
              const screenshots = pngs
                .filter((png) => png.includes(htmlName))
                .sort();

              return (
                <li key={html}>
                  <Link href={`/tests/static/${groupName}/${html}`}>
                    {htmlName}
                  </Link>
                  {screenshots.length > 0 && (
                    <ul>
                      {screenshots.map((png) => (
                        <li key={png}>
                          <small>
                            {titleize(png.split(".").slice(0, 2).join(" "))}
                          </small>
                          <Image
                            src={`/how2avar2/tests/static/${groupName}/${png}`}
                            alt={png}
                            width={1440}
                            height={400}
                            unoptimized
                            className="block mt-2 mb-6 border rounded shadow-sm"
                          />
                        </li>
                      ))}
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
