import { createMDX } from "fumadocs-mdx/next";
import { syncStaticAssets } from "./scripts/syncStaticAssets.mjs";

await syncStaticAssets();

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  output: "export",
  trailingSlash: true,
  basePath: "/how2avar2",
  images: { unoptimized: true },
  turbopack: {
    root: import.meta.dirname,
  },
};

export default withMDX(config);
