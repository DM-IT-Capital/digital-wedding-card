import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Digital Wedding Card Portal",
  description: "Creator dashboard and public digital wedding cards"
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
