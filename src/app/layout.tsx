import Background from "@/components/Background";
import type { Metadata } from "next";
// These styles apply to every route in the application
import Header from "@/components/Header";
import "./globals.css";
import { Onest } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
const onest = Onest({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GitHub Circles",
  description:
    "See at a glance the folks and projects you've been vibing with on GitHub. Capture the essence of your GitHub circle in a single image",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.githubcircles.xyz/",
    siteName: "GitHub Circles",
    title: "GitHub Circles: Generate GitHub Visual Representation",
    description:
      "See at a glance the folks and projects you've been vibing with on GitHub. Capture the essence of your GitHub circle in a single image",
    images: [
      {
        url: "/github-circles-og.png",
        width: 1200,
        height: 630,
        alt: "GitHub Circles",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [
      {
        url: "/github-circles-og.png",
        width: 1200,
        height: 630,
        alt: "GitHub Circles",
        type: "image/png",
      },
    ],
  },
  keywords:
    "Github, GitHub Visual Representation, GitHub Circle, GitHub Circle Generator, GitHub Circle Image, GitHub Circle Image Generator, GitHub Circle Maker, GitHub Circle Creator, GitHub Circle Creator Online, GitHub Circle Creator Tool, GitHub Circle Creator App, GitHub Circle Creator Website, GitHub Circle Creator Software, GitHub Circle Creator Program, GitHub Circle Creator Application, GitHub Circle Creator Service, GitHub Circle Creator Company, GitHub Circle Creator Business, GitHub Circle Creator Product, GitHub Circle Creator Solution, GitHub Circle Creator System, GitHub Circle Creator Platform",
  metadataBase: new URL("https://www.githubcircles.xyz/"),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

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
        <link rel="icon" href="/favicon.svg" sizes="any" />
        {/* <title>GitHub Circles</title>
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
        /> */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        {/* <meta
          property="og:image"
          content={"/github-circle-og.png"}
          key="og:image"
        />
        <meta
          name="twitter:image"
          content={"/github-circle-og.png"}
          key="twitter:image"
        /> */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        {/* @ts-ignore */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
      </head>
      <body
        className={
          "transition-[background-position background-size] duration-1000 ease-slow grid min-h-screen gap-2 px-4 py-4 md:px-8 md:py-6" +
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
        <Analytics />
      </body>
    </html>
  );
}
