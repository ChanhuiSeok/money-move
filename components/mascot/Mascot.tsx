import { cn } from "@/lib/utils";

export type MascotMood = "idle" | "happy" | "encouraging" | "celebrate";

/** 돈길 마스코트 "돈이" — 둥근 엽전(코인) 캐릭터. 표정으로 상황을 표현한다. */
export function Mascot({
  mood = "idle",
  className,
}: {
  mood?: MascotMood;
  className?: string;
}) {
  const blush = mood === "happy" || mood === "celebrate";
  const arcEyes = mood === "celebrate";

  return (
    <svg
      viewBox="0 0 100 100"
      className={cn("size-16", className)}
      role="img"
      aria-label="마스코트 돈이"
    >
      <defs>
        <linearGradient id="don-coin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
      </defs>

      {/* 코인 테두리 + 밝은 얼굴면 */}
      <circle cx="50" cy="50" r="46" fill="url(#don-coin)" />
      <circle cx="50" cy="50" r="37" fill="#eff6ff" />

      {/* 동전 느낌의 ₩ */}
      <text
        x="50"
        y="33"
        textAnchor="middle"
        fontSize="11"
        fontWeight="700"
        fill="#2563eb"
        opacity="0.5"
      >
        ₩
      </text>

      {/* 볼터치 */}
      {blush && (
        <>
          <circle cx="32" cy="58" r="4" fill="#fb7185" opacity="0.45" />
          <circle cx="68" cy="58" r="4" fill="#fb7185" opacity="0.45" />
        </>
      )}

      {/* 눈 */}
      {arcEyes ? (
        <>
          <path d="M34 49 Q39 43 44 49" fill="none" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
          <path d="M56 49 Q61 43 66 49" fill="none" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="39" cy="48" r="4.5" fill="#1e293b" />
          <circle cx="61" cy="48" r="4.5" fill="#1e293b" />
          <circle cx="40.6" cy="46.4" r="1.4" fill="#fff" />
          <circle cx="62.6" cy="46.4" r="1.4" fill="#fff" />
        </>
      )}

      {/* 입 */}
      {mood === "celebrate" ? (
        <ellipse cx="50" cy="63" rx="6.5" ry="5" fill="#1e293b" />
      ) : mood === "happy" ? (
        <path d="M38 60 Q50 72 62 60" fill="none" stroke="#1e293b" strokeWidth="3.2" strokeLinecap="round" />
      ) : mood === "encouraging" ? (
        <path d="M41 62 Q50 67 59 62" fill="none" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
      ) : (
        <path d="M40 61 Q50 68 60 61" fill="none" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
      )}
    </svg>
  );
}
