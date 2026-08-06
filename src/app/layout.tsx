import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import ClientApp from "@/components/ClientApp";
import Script from "next/script";
import ThirdPartyScripts from "@/components/ThirdPartyScripts";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });
const manrope = Manrope({ subsets: ["latin"], display: "swap", variable: "--font-manrope" });

export const metadata: Metadata = {
  title: "HitAds.ca - Free Ads. Sell Fast. Buy Local. Canada-Wide.",
  description: "Buy and sell locally in Canada. Free ads for vehicles, real estate, jobs, services and more on HitAds.ca.",
  verification: {
    google: "Wded4juWATB0pGbu0HrLHrUu7ujY55TlXEflNXejU7M",
  },
  icons: {
    icon: "/assets/HitAds.png",
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
        {/* Preconnect to Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Material Icons - High Priority Preload & Swap */}
        <link 
          rel="preload" 
          href="https://fonts.googleapis.com/icon?family=Material+Icons&display=swap" 
          as="style" 
        />
        <link 
          rel="stylesheet" 
          href="https://fonts.googleapis.com/icon?family=Material+Icons&display=swap" 
        />
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
