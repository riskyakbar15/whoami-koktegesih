"use client";

// Replaces the root layout, so it cannot rely on layout fonts or shared chrome.
export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          padding: "1.25rem",
          textAlign: "center",
          background: "#0e1116",
          color: "#edede6",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
        }}
      >
        <p style={{ margin: 0, fontSize: "0.75rem", letterSpacing: "0.2em", color: "#ff5c38" }}>
          ERROR 500 // SIGNAL LOST
        </p>
        <h1 style={{ margin: 0, fontSize: "2.5rem", fontWeight: 700 }}>
          Transmission Failed
        </h1>
        <p style={{ margin: 0, maxWidth: "28rem", fontSize: "0.875rem", color: "#8a94a6" }}>
          The application could not recover. Reload to re-establish the
          connection.
        </p>
        <button
          type="button"
          onClick={reset}
          style={{
            marginTop: "1rem",
            border: 0,
            borderRadius: "2px",
            background: "#ff5c38",
            color: "#0e1116",
            padding: "0.75rem 1.25rem",
            fontFamily: "inherit",
            fontSize: "0.875rem",
            cursor: "pointer",
          }}
        >
          Retry
        </button>
      </body>
    </html>
  );
}
