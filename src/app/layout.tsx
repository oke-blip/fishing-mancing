import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Captain Gutom — Motion Comic",
  description:
    "A scroll-driven motion comic: Captain Gutom vs. the monster of the shelf.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
