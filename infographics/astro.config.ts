import { defineConfig } from "astro/config";
import { viteStaticCopy } from "vite-plugin-static-copy";

// https://astro.build/config
export default defineConfig({
  devToolbar: {
    enabled: false,
  },
  vite: {
    plugins: [
      viteStaticCopy({
        targets: [
          {
            src: "../fonts/variable/*",
            dest: "static/fonts/",
          },
        ],
      }),
    ],
  },
});
