import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const klaxonCrunchy = localFont({
  src: "./fonts/Klaxon-Crunchy.otf",
  variable: "--font-klaxon-crunchy",
});

const klaxonSmooth = localFont({
  src: "./fonts/Klaxon-Smooth.otf",
  variable: "--font-klaxon-smooth",
});

export const metadata: Metadata = {
  title: "PARTOFU - Branding & Technology Studio",
  description: "Branding & Technology Studio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${klaxonCrunchy.variable} ${klaxonSmooth.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
