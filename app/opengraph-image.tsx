import { ImageResponse } from "next/og";

export const alt = "Risky Akbar: Cyber Security Portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        backgroundColor: "#0e1116",
        padding: "80px",
        fontFamily: "monospace",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 24,
          right: 24,
          bottom: 24,
          left: 24,
          border: "2px solid #2a3342",
        }}
      />
      <div
        style={{
          display: "flex",
          fontSize: 26,
          letterSpacing: 8,
          color: "#ff5c38",
        }}
      >
        CLASSIFIED // ACCESS GRANTED
      </div>
      <div
        style={{
          display: "flex",
          marginTop: 24,
          fontSize: 96,
          fontWeight: 700,
          color: "#edede6",
        }}
      >
        Risky Akbar
      </div>
      <div
        style={{
          display: "flex",
          marginTop: 16,
          fontSize: 34,
          color: "#8a94a6",
        }}
      >
        Cyber Security Portfolio
      </div>
      <div
        style={{
          display: "flex",
          marginTop: 48,
          fontSize: 24,
          letterSpacing: 4,
          color: "#5c6675",
        }}
      >
        riskyakbar.my.id · UID 0xA1F4-CYB3R
      </div>
      <div
        style={{
          position: "absolute",
          right: 56,
          bottom: 56,
          display: "flex",
          fontSize: 26,
          fontWeight: 700,
          letterSpacing: 3,
          color: "#0e1116",
          backgroundColor: "#ff5c38",
          padding: "14px 28px",
        }}
      >
        VIEW DOSSIER →
      </div>
    </div>,
    { ...size },
  );
}
