import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";

export const alt = `${profile.name} — ${profile.headline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Dot-matrix field echoing the hero: deterministic so the image is stable between builds.
const dots = Array.from({ length: 22 * 9 }, (_, i) => {
  const x = i % 22;
  const y = Math.floor(i / 22);
  const v = Math.sin(x * 1.7 + y * 2.3) * Math.cos(x * 0.6 - y * 1.1);
  return { x, y, o: Math.max(0.06, (v + 1) / 2.6) };
});

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#07080b",
          color: "#e8ecf3",
          padding: 72,
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", right: 60, top: 60, display: "flex", flexWrap: "wrap", width: 22 * 22, gap: 0 }}>
          {dots.map((d) => (
            <div key={`${d.x}-${d.y}`} style={{ width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 8, height: 8, borderRadius: 8, background: d.y % 4 === 1 && d.x % 5 === 2 ? "#3de0ff" : "#c6ff3d", opacity: d.o }} />
            </div>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 24, color: "#8b93a7", letterSpacing: 4 }}>
          <div style={{ width: 14, height: 14, borderRadius: 14, background: "#c6ff3d" }} />
          INPUT → EMBEDDING → ATTENTION → OUTPUT
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 120, fontWeight: 700, lineHeight: 1, letterSpacing: -4, color: "#e8ecf3" }}>Chetan Gadhiya</div>
          <div style={{ marginTop: 28, fontSize: 44, color: "#c6ff3d", fontWeight: 600 }}>{profile.headline}</div>
          <div style={{ marginTop: 12, fontSize: 32, color: "#8b93a7" }}>{profile.tagline}</div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: "#8b93a7" }}>
          <span>chetangadhiya.vercel.app</span>
          <span>Production-grade AI systems</span>
        </div>
      </div>
    ),
    size,
  );
}
