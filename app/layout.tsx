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
  title: "Incident Post-Mortem Generator — postmortem.buildingai.in",
  description: "Run /postmortem in your Slack incident channel. We pull Slack history, PagerDuty logs, and GitHub deploys — then draft a structured RCA in ~60 seconds.",
  openGraph: {
    title: "Incident Post-Mortem Generator",
    description: "From incident to written post-mortem in 60 seconds. Free Slack bot.",
    url: "https://postmortem.buildingai.in",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
