import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const inter = localFont({
  src: "../../public/fonts/inter.woff2",
  variable: "--font-inter",
  display: "swap",
});

const outfit = localFont({
  src: "../../public/fonts/outfit.woff2",
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Carbon Twin AI™ | Digital Footprint Simulator",
  description: "Calculate your annual carbon footprint, visualize planetary consequences, and simulate lifestyle habit shifts in real-time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
