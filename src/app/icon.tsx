import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0d0c0a",
          color: "#f2b05e",
          fontSize: 34,
          fontWeight: 700,
          borderRadius: 14,
          border: "3px solid #1c2230",
        }}
      >
        CG
      </div>
    ),
    size,
  );
}
