import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Forge: name and brand your idea",
  description: "Describe a business idea and get a shortlist of names, taglines, colors, and type to start your brand.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-canvas font-sans text-fg">{children}</body>
    </html>
  );
}
