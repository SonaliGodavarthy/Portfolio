import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";
import Nav from "@/components/Nav";
import { FramingProvider } from "@/lib/framing";
import "./globals.css";

const description =
  "AI researcher and engineer working on generative AI and computer vision. ICPR 2026 oral (MULTI) and ECCV 2026 workshop paper (X-MULTI).";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://sonali-portfolio-one.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Sonali Godavarthy",
  description,
  keywords: [
    "Sonali Godavarthy",
    "AI Researcher",
    "AI Engineer",
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
