// 상황별 격려 문구 (docs/tone-guide.md 준수). 마스코트(Task 1.6)와 공유.

export const correctLines = [
  "오, 좋은데요? ✨",
  "정확해요!",
  "딱이에요!",
  "이 기세 그대로!",
  "역시!",
];

export const wrongLines = [
  "괜찮아요, 같이 다시 봐요.",
  "거의 다 왔어요!",
  "헷갈릴 수 있어요. 한 번 더 볼까요?",
];

export const completeLines = [
  "잘했어요! 오늘 한 걸음 더 갔어요 🎉",
  "멋져요! 내일도 기다릴게요.",
  "오늘의 한 입, 완료! 🍪",
];

export const reviewDoneLines = [
  "복습 끝! 머릿속에 더 단단히 자리 잡았어요 🧠",
  "오늘 복습 완료! 까먹기 전에 잘 잡았어요.",
  "한 번 더 보니 확실히 내 것이 됐죠? 👍",
];

export const reviewEmptyLines = [
  "지금은 복습할 게 없어요. 깔끔하네요! ✨",
  "복습 대기열이 비었어요. 새 레슨으로 채워볼까요?",
];

export const greetingLines = [
  "안녕하세요! 오늘도 한 걸음 가볼까요?",
  "다시 와줘서 반가워요 😊",
  "오늘의 한 입, 가볍게 시작해요!",
  "조금씩 쌓이면 큰 차이가 돼요.",
];

/** 배열에서 무작위로 하나 고른다(클라이언트 전용). */
export function pick<T>(lines: readonly T[]): T {
  return lines[Math.floor(Math.random() * lines.length)];
}
