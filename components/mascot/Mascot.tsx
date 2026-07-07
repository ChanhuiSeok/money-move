import { cn } from "@/lib/utils";

export type MascotMood = "idle" | "happy" | "encouraging" | "celebrate";

/** 머니무브 마스코트 "무브" — 갓 주조된 동전 캐릭터.
   주조 테두리(리딩)·베벨·상단 하이라이트로 납작한 원이 아니라 '입체 동전'으로 읽히게 했다.
   표정(mood)으로 상황을 표현한다. 순수 SVG라 서버·클라이언트 어디서든 렌더된다. */
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
      aria-label="머니무브 마스코트"
    >
      <defs>
        {/* 동전 몸통 — 좌상단이 밝고 우하단이 어두운 대각 사면 */}
        <linearGradient id="mm-coin" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4d8eff" />
          <stop offset="48%" stopColor="#1f6dff" />
          <stop offset="100%" stopColor="#0a45c0" />
        </linearGradient>
        {/* 얼굴면 — 좌상단에서 빛이 든 부드러운 돔 */}
        <radialGradient id="mm-face" cx="38%" cy="32%" r="80%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#d9e7ff" />
        </radialGradient>
      </defs>

      {/* 동전 몸통 */}
      <circle cx="50" cy="50" r="47" fill="url(#mm-coin)" />
      {/* 주조 테두리(리딩) — 점선 링으로 동전 특유의 톱니 가장자리 */}
      <circle
        cx="50"
        cy="50"
        r="44.5"
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.28"
        strokeWidth="2.4"
        strokeDasharray="0.6 3.35"
      />
      {/* 안쪽 홈(그림자) + 하이라이트로 각인된 테를 표현 */}
      <circle cx="50" cy="50" r="40.5" fill="none" stroke="#08307f" strokeOpacity="0.22" strokeWidth="1.4" />
      <circle cx="50" cy="50" r="39" fill="none" stroke="#bcd4ff" strokeOpacity="0.5" strokeWidth="1" />

      {/* 얼굴면 */}
      <circle cx="50" cy="50" r="36" fill="url(#mm-face)" />
      {/* 상단 하이라이트(광택) */}
      <ellipse
        cx="34"
        cy="34"
        rx="7.5"
        ry="4.6"
        fill="#ffffff"
        opacity="0.5"
        transform="rotate(-32 34 34)"
      />

      {/* 각인된 ₩ — 이마 위쪽에 은은하게 */}
      <text
        x="50"
        y="33"
        textAnchor="middle"
        fontFamily="var(--font-sans)"
        fontSize="9"
        fontWeight="800"
        fill="#1f6dff"
        opacity="0.3"
      >
        ₩
      </text>

      {/* 볼터치 */}
      {blush && (
        <>
          <ellipse cx="30.5" cy="58" rx="4" ry="3" fill="#fb7185" opacity="0.4" />
          <ellipse cx="69.5" cy="58" rx="4" ry="3" fill="#fb7185" opacity="0.4" />
        </>
      )}

      {/* 눈 */}
      {arcEyes ? (
        <>
          <path d="M33.5 51 Q38 45.5 42.5 51" fill="none" stroke="#16233f" strokeWidth="3" strokeLinecap="round" />
          <path d="M57.5 51 Q62 45.5 66.5 51" fill="none" stroke="#16233f" strokeWidth="3" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="38" cy="50" r="4.4" fill="#16233f" />
          <circle cx="62" cy="50" r="4.4" fill="#16233f" />
          <circle cx="39.7" cy="48.4" r="1.35" fill="#fff" />
          <circle cx="63.7" cy="48.4" r="1.35" fill="#fff" />
        </>
      )}

      {/* 입 */}
      {mood === "celebrate" ? (
        <ellipse cx="50" cy="62" rx="5.6" ry="4.6" fill="#16233f" />
      ) : mood === "happy" ? (
        <path d="M39 60 Q50 70 61 60" fill="none" stroke="#16233f" strokeWidth="3.2" strokeLinecap="round" />
      ) : mood === "encouraging" ? (
        <path d="M42 61 Q50 66 58 61" fill="none" stroke="#16233f" strokeWidth="3" strokeLinecap="round" />
      ) : (
        <path d="M41 60 Q50 67 59 60" fill="none" stroke="#16233f" strokeWidth="3" strokeLinecap="round" />
      )}
    </svg>
  );
}
