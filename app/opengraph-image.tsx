import { ImageResponse } from "next/og";
import fs from "fs";
import path from "path";

export const alt = "머니무브 - 경제 문맹 퇴치";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const runtime = "nodejs";

export default async function Image() {
  // Use turbopackIgnore comment to avoid NFT trace warnings
  const logoPath = path.join(
    /*turbopackIgnore: true*/ process.cwd(),
    "components/brand/assets/logo.png"
  );

  const logoBuffer = fs.readFileSync(logoPath);
  const logoBase64 = `data:image/png;base64,${logoBuffer.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#eef5ff", // Light brand blue tint for high contrast with dark logo text
          border: "16px solid #1f1b19", // Thick chunky border on the outer edge
          boxSizing: "border-box",
        }}
      >
        {/* Enlarge logo to 810x250 (~3.24:1 ratio) */}
        <img
          src={logoBase64}
          alt="머니무브"
          style={{
            width: 810,
            height: 250,
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
