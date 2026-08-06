import type { Metadata, Viewport } from "next";
import "./globals.css";
import { MobileFullscreenHandler } from "@/components/MobileFullscreenHandler";

export const metadata: Metadata = {
  title: "Captain Gutom — Motion Comic",
  description:
    "A scroll-driven motion comic: Captain Gutom vs. the monster of the shelf.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black",
    title: "Captain Gutom",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  /* Browser UI / keyboard resizes the layout viewport instead of overlaying it */
  interactiveWidget: "resizes-content",
  themeColor: "#0a1628",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <MobileFullscreenHandler />
        {children}
      </body>
    </html>
  );
}
