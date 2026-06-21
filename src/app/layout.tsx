import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const inter = localFont({
  src: '../../public/fonts/inter.woff2',
  variable: '--font-inter',
  display: 'swap'
});

const outfit = localFont({
  src: '../../public/fonts/outfit.woff2',
  variable: '--font-outfit',
  display: 'swap'
});

export const metadata: Metadata = {
  title: {
    default: 'Carbon Twin AI™ | Digital Footprint Simulator',
    template: '%s | Carbon Twin AI™'
  },
  description:
    'Calculate your annual carbon footprint, visualize planetary consequences, and simulate lifestyle habit shifts in real-time.',
  applicationName: 'Carbon Twin AI',
  keywords: ['carbon footprint calculator', 'digital twin', 'climate simulator', 'sustainability']
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
