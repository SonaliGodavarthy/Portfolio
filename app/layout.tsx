import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Nav from "@/components/Nav";
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
  title: "Sonali Godavarthy — AI Researcher & Engineer",
  description:
    "Portfolio of Sonali Godavarthy — AI Researcher and Engineer specializing in Generative AI, Computer Vision, and Foundation Models. Published at ICPR 2026 and ECCV 2026.",
  keywords: [
    "AI Researcher",
    "AI Engineer",
    "Generative AI",
    "Computer Vision",
    "Diffusion Models",
    "Foundation Models",
    "Machine Learning",
    "Sonali Godavarthy",
  ],
  authors: [{ name: "Sonali Godavarthy" }],
  openGraph: {
    title: "Sonali Godavarthy — AI Researcher & Engineer",
    description:
      "Building at the intersection of generative AI, computer vision, and production systems.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#0d0d0d] text-[#f0f0f0]">
        <Nav />
        {children}
      </body>
    </html>
  );
}
