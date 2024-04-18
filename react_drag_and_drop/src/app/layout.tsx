import type { Metadata } from "next";
import "./globals.scss";

export const metadata: Metadata = {
  title: "Image upload",
  description: "Drag and drop file input component",
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode;}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
