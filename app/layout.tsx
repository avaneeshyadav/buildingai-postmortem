import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BuildingAI — Automated Incident Post-Mortem Generator for SRE & DevOps Teams",
  description:
    "Run /postmortem in Slack. Get a structured RCA draft in 60 seconds — pulling from Slack history, PagerDuty incidents, and GitHub deploys. Free for early teams.",
  keywords: [
    "automated post-mortem generator",
    "incident post-mortem template slack",
    "root cause analysis automation tool",
    "automated RCA devops",
    "SRE post-mortem workflow",
    "MTTR reduction tool",
    "slack incident bot post-mortem",
    "post-mortem as a service",
  ],
  authors: [{ name: "Avaneesh Yadav", url: "https://buildingai.in" }],
  metadataBase: new URL("https://postmortem.buildingai.in"),
  alternates: {
    canonical: "https://postmortem.buildingai.in",
  },
  openGraph: {
    title: "Your last incident ended. The post-mortem hasn't started.",
    description:
      "Run /postmortem in Slack. Get a structured RCA draft in 60 seconds from Slack history, PagerDuty logs, and GitHub deploys. Free for early teams.",
    url: "https://postmortem.buildingai.in",
    siteName: "Postmortem Bot — buildingai.in",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Your last incident ended. The post-mortem hasn't started.",
    description:
      "Run /postmortem in Slack. Structured RCA draft in 60 seconds from Slack, PagerDuty, and GitHub. Free for early teams.",
    creator: "@buildingai_in",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Postmortem Bot",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Slack",
  description:
    "AI-powered Slack bot that automatically generates incident post-mortems and root cause analysis documents from Slack history, PagerDuty incidents, and GitHub deploys.",
  url: "https://postmortem.buildingai.in",
  author: {
    "@type": "Person",
    name: "Avaneesh Yadav",
    url: "https://buildingai.in",
  },
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    description: "Free during early access",
  },
  featureList: [
    "Automated RCA generation",
    "Slack integration",
    "PagerDuty integration",
    "GitHub commits and deploys",
    "Stateless — no data stored",
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
