import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// 단위 테스트용 — "@/..." 별칭을 프로젝트 루트로 매핑한다.
const root = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  resolve: {
    alias: { "@": root },
  },
  test: {
    environment: "node",
    include: ["**/*.test.ts"],
  },
});
