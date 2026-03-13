import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CRYPTO GRID_FINDER | Find Crypto Merchants Worldwide",
  description: "A global locator that finds real-world shops, cafes, and malls accepting Bitcoin, Ethereum, and 200+ cryptocurrencies.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#00FF94" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="CryptoFinder" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body suppressHydrationWarning={true} className="bg-cyber-black text-text-primary antialiased font-mono">
        {children}
      </body>
    </html>
  );
}
