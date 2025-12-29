import Link from "next/link";
import Image from "next/image";
import sophiaSans from "../../../public/static/images/sophia-sans.png";

export default function HomePage() {
  return (
    <>
      <div className="prose dark:prose-invert mx-auto mt-16 max-w-lg">
        <h1>How2Avar2</h1>
        <p>
          This website documents the new avar2 format, showcases avar2 features,
          and provides examples of how to implement avar2 in your own fonts.
        </p>
        <div className="not-prose flex flex-row gap-4">
          <Link
            href="/docs/features/"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-neutral-950 focus-visible:ring-neutral-950/50 focus-visible:ring-[3px] aria-invalid:ring-red-500/20 dark:aria-invalid:ring-red-500/40 aria-invalid:border-red-500 dark:focus-visible:border-neutral-300 dark:focus-visible:ring-neutral-300/50 dark:aria-invalid:ring-red-900/20 dark:dark:aria-invalid:ring-red-900/40 dark:aria-invalid:border-red-900 bg-neutral-900 text-neutral-50 shadow-xs hover:bg-neutral-900/90 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50/90 h-9 px-4 py-2 has-[>svg]:px-3"
          >
            Avar2 Features
          </Link>
          <Link
            target="_blank"
            href="https://lorp.github.io/fencer/src/fencer.html"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-neutral-950 focus-visible:ring-neutral-950/50 focus-visible:ring-[3px] aria-invalid:ring-red-500/20 dark:aria-invalid:ring-red-500/40 aria-invalid:border-red-500 dark:focus-visible:border-neutral-300 dark:focus-visible:ring-neutral-300/50 dark:aria-invalid:ring-red-900/20 dark:dark:aria-invalid:ring-red-900/40 dark:aria-invalid:border-red-900 border bg-white shadow-xs hover:bg-neutral-100 hover:text-neutral-900 dark:bg-neutral-200/30 dark:border-neutral-200 dark:hover:bg-neutral-200/50 dark:bg-neutral-950 dark:hover:bg-neutral-800 dark:hover:text-neutral-50 dark:dark:bg-neutral-800/30 dark:dark:border-neutral-800 dark:dark:hover:bg-neutral-800/50 h-9 px-4 py-2 has-[>svg]:px-3"
          >
            Fencer App
          </Link>
        </div>
        <figure>
          <Image
            loading="eager"
            src={sophiaSans}
            alt="2d graph visualization of the designspace of Sophia Sans with distortions"
          />
          <figcaption>
            Visualization of the avar2 designspace distortions in Sophia Sans
          </figcaption>
        </figure>
      </div>
    </>
  );
}
