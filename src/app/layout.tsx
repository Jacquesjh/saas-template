import type {Viewport} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import {Providers} from "@/providers/providers";
import config from "@/config";
import {getCurrentUser} from "@/lib/session";
import {getSEOTags} from "@/lib/seo";

const font = Inter({subsets: ["latin"]});

export const viewport: Viewport = {
  // Will use the primary color of your theme to show a nice theme color in the URL bar of supported browsers
  themeColor: config.colors.main,
  width: "device-width",
  initialScale: 1,
};

// This adds default SEO tags to all pages in our app.
// You can override them in each page passing params to getSOTags() function.
export const metadata = getSEOTags();

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // This makes the user accessible accross the entire application
  const user = await getCurrentUser();

  return (
    <html lang="en" data-theme={config.colors.theme} className={font.className}>
      <body>
        <Providers user={user}>{children}</Providers>
      </body>
    </html>
  );
}
