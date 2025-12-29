import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: "How2Avar2",
    },
    githubUrl: "https://github.com/googlefonts/how2avar2",
    links: [
      {
        text: "Features",
        url: "/docs/features/",
        // secondary items will be displayed differently on navbar
        secondary: false,
      },
      {
        text: "Support",
        url: "/docs/support/",
        // secondary items will be displayed differently on navbar
        secondary: false,
      },
    ],
  };
}
