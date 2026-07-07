import { ImageResponse } from "next/og";

export const alt = "머니무브 — 경제 문맹 퇴치";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const FONT_URL =
  "https://cdn.jsdelivr.net/npm/pretendard@1.3.9/dist/public/static/alternative/Pretendard-Bold.ttf";

export default async function Image() {
  const fontData = await fetch(FONT_URL).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 28,
          fontFamily: "Pretendard",
          background:
            "linear-gradient(135deg, #1d4ed8 0%, #2563eb 55%, #0ea5e9 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 168,
            height: 168,
            borderRadius: "50%",
            background: "#eff6ff",
            color: "#2563eb",
            fontSize: 88,
            fontWeight: 700,
          }}
        >
          ₩
        </div>
        <div style={{ display: "flex", fontSize: 92, color: "white" }}>
          머니무브
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 36,
            color: "rgba(255,255,255,0.92)",
          }}
        >
          경제 문맹 퇴치 · 가입 없이 바로 시작
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Pretendard", data: fontData, style: "normal", weight: 700 }],
    }
  );
}
