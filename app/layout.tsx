import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Coinage — coin a name, strike a brand",
  description:
    "Describe what you're building. Coinage coins a shortlist of names, stress-tests each one, and strikes it into a full brand you can see in the wild.",
};

const FONTS =
  "https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&family=Instrument+Serif:ital@0;1&display=swap";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href={FONTS} />
      </head>
      <body className="min-h-screen bg-paper font-sans text-ink">{children}</body>
    </html>
  );
}
