/** 정답 효과음 — 짧고 명랑한 '도-미-솔-도' 아르페지오.
   Web Audio API로 합성하므로 음원 파일이 필요 없다. 브라우저에서만,
   사용자 클릭('정답 확인') 직후 호출되어 자동재생 정책에도 걸리지 않는다. */

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const w = window as Window & { webkitAudioContext?: typeof AudioContext };
  const AC = window.AudioContext ?? w.webkitAudioContext;
  if (!AC) return null;
  ctx ??= new AC();
  return ctx;
}

/** 정답을 맞혔을 때 한 번 재생. 지원하지 않는 환경에선 조용히 아무것도 안 한다. */
export function playCorrectChime(): void {
  const audio = getCtx();
  if (!audio) return;
  // 사용자 동작 전이라 suspended면 깨운다(이 호출 자체가 클릭 핸들러 안).
  if (audio.state === "suspended") void audio.resume();

  const now = audio.currentTime;
  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5·E5·G5·C6 (도-미-솔-도)
  const step = 0.075; // 음 간격
  const dur = 0.16; // 한 음 길이

  for (let i = 0; i < notes.length; i++) {
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    osc.type = "triangle"; // 둥글고 부드러운 음색
    osc.frequency.value = notes[i];

    const start = now + i * step;
    // 톡 튀었다가 부드럽게 사라지는 엔벨로프
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.16, start + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);

    osc.connect(gain).connect(audio.destination);
    osc.start(start);
    osc.stop(start + dur + 0.02);
  }
}
