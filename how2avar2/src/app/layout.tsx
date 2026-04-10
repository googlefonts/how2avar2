import "@fortawesome/fontawesome-svg-core/styles.css";
import "./global.css";

import { Inter } from "next/font/google";
import { Providers } from "@/components/Providers";

const inter = Inter({
  subsets: ["latin"],
});

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
