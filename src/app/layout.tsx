import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import ClientApp from "@/components/ClientApp";
import Script from "next/script";
import MaterialIconsLoader from "@/components/MaterialIconsLoader";

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

        {/* Material Icons Non-Render-Blocking */}
        <MaterialIconsLoader />
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

        {/* Google Tag Manager */}
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-P9WWQ4H7');`}
        </Script>
        {/* Google Ads gtag */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=AW-18199746339" strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'AW-18199746339');`}
        </Script>
        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3441444514820988"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
