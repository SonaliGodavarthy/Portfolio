import { ImageResponse } from "next/og";

export const alt = "Sonali Godavarthy, AI researcher and engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Night ground with the lavender light from the hero.
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "radial-gradient(circle at 75% 45%, #3a2d73 0%, #141024 45%, #0d0a18 100%)",
          padding: "0 72px",
          position: "relative",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", marginTop: 150, color: "#f1edff" }}>
          <div style={{ fontSize: 120, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 0.9 }}>Sonali</div>
          <div style={{ fontSize: 120, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 0.9 }}>Godavarthy</div>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 70,
            fontSize: 32,
            color: "#f1edff",
            fontWeight: 600,
          }}
        >
          AI Researcher and Engineer. ICPR 2026 oral, ECCV 2026 workshop.
        </div>
        <div
          style={{
            position: "absolute",
            right: 150,
            top: 170,
            width: 46,
            height: 46,
            borderRadius: 46,
            background: "#b9a7ff",
          }}
        />
      </div>
    ),
    size,
  );
}
