import type { Metadata } from "next";
import "./globals.css";
import ClientApp from "@/components/ClientApp";

export const metadata: Metadata = {
  title: "HitAds - Market Hub",
  description: "Your local marketplace",
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
      <body className="min-h-full flex flex-col">
        <ClientApp>
          {children}
        </ClientApp>
      </body>
    </html>
  );
}
