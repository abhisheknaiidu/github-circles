import Background from "@/components/Background";
import type { Metadata } from "next";
// These styles apply to every route in the application
import Header from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

import { Onest } from "next/font/google";

// If loading a variable font, you don't need to specify the font weight
const onest = Onest({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0,maximum-scale=1.0 viewport-fit=cover minimal-ui user-scalable=no"
        />
        <title>GitHub Circles</title>
        <meta name="description" content="Generate GitHub Circles" />
        <meta property="og:title" content="GitHub Circles" key="og:title" />
        <meta
          property="og:description"
          content="Generate GitHub Circles"
          key="og:description"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="GitHub Circles"
          key="twitter:title"
        />

        <meta
          name="twitter:description"
          content="Generate GitHub Circles"
          key="twitter:description"
        />
        <meta
          name="twitter:url"
          content="https://www.githubcircles.xyz/"
          key="twitter:url"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />

        <meta
          property="og:image"
          content={"/github-circle-og.png"}
          key="og:image"
        />
        <meta
          name="twitter:image"
          content={"/github-circle-og.png"}
          key="twitter:image"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        {/* @ts-ignore */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
      </head>
      <body
        className={
          "transition-[background-position background-size] duration-1000 ease-slow grid min-h-screen gap-2 px-8 py-6" +
          " " +
          onest.className
        }
        style={{
          gridTemplateRows: "auto 1fr",
        }}
      >
        <Header />
        <Background />
        {children}
      </body>
    </html>
  );
}
