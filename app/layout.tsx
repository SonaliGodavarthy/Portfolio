import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";
import Nav from "@/components/Nav";
import ChatWidget from "@/components/ChatWidget";
import ColorTrail from "@/components/ColorTrail";
import SocialRail from "@/components/SocialRail";
import { FramingProvider } from "@/lib/framing";
import "./globals.css";

const description =
  "AI research engineer working on generative AI and computer vision. ICPR 2026 oral (MULTI) and ECCV 2026 workshop paper (X-MULTI).";

// An explicit NEXT_PUBLIC_SITE_URL wins (set it for a custom domain); otherwise
// Vercel supplies the project's permanent address at build time.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Sonali Godavarthy",
  description,
  keywords: [
    "Sonali Godavarthy",
    "AI Research Engineer",
    "Generative AI",
    "Computer Vision",
    "Diffusion Models",
    "Disentanglement",
    "ICPR 2026",
    "ECCV 2026",
  ],
  authors: [{ name: "Sonali Godavarthy" }],
  openGraph: {
    title: "Sonali Godavarthy",
    description,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sonali Godavarthy",
    description,
  },
};

export const viewport: Viewport = {
  themeColor: "#0d0a18",
  // Paint under the notch and home indicator; content pads itself with env() insets.
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-full">
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100]
                     focus:rounded-full focus:bg-lavender focus:px-5 focus:py-3 focus:text-paper focus:font-semibold"
        >
          Skip to content
        </a>
        <FramingProvider>
          <Nav />
          <div id="content" tabIndex={-1} className="outline-none">
            {children}
          </div>
          <SocialRail />
          <ChatWidget />
          <ColorTrail />
        </FramingProvider>
        <Toaster
          position="bottom-center"
          toastOptions={{
            unstyled: false,
            style: {
              background: "transparent",
              color: "#f1edff",
              border: "none",
              borderRadius: "18px",
              fontFamily: "var(--font-sans)",
            },
            classNames: { toast: "material-dark", description: "!text-[#e8e3f8]" },
          }}
        />
      </body>
    </html>
  );
}
