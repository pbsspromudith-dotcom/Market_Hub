import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import ClientApp from "@/components/ClientApp";
import Script from "next/script";
import ThirdPartyScripts from "@/components/ThirdPartyScripts";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });
const manrope = Manrope({ subsets: ["latin"], display: "swap", variable: "--font-manrope" });

export const metadata: Metadata = {
  metadataBase: new URL("https://hitads.ca"),
  title: "HitAds.ca - Free Ads. Sell Fast. Buy Local. Canada-Wide.",
  description: "Buy and sell locally in Canada. Free ads for vehicles, real estate, jobs, services and more on HitAds.ca.",
  alternates: {
    canonical: "https://hitads.ca",
  },
  verification: {
    google: ["Wded4juWATB0pGbu0HrLHrUu7ujY55TlXEflNXejU7M", "c-cidgyEcNErCFJpYOhfp_RQm8Cqm9Xn1uHpVmNkvVM"],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.png', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <head>
        <meta name="google-site-verification" content="Wded4juWATB0pGbu0HrLHrUu7ujY55TlXEflNXejU7M" />
        <meta name="google-site-verification" content="c-cidgyEcNErCFJpYOhfp_RQm8Cqm9Xn1uHpVmNkvVM" />
        {/* Favicon links for Google Search crawler and modern browsers */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        {/* Preconnect to Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`min-h-full flex flex-col bg-background-light text-slate-900 ${inter.variable} ${manrope.variable} ${inter.className}`}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-P9WWQ4H7"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        <ClientApp>
          {children}
        </ClientApp>

        {/* Optimized Third Party Marketing & Ad Scripts */}
        <ThirdPartyScripts />
      </body>
    </html>
  );
}
