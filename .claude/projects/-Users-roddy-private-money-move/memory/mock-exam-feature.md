---
name: mock-exam-feature
description: 모의고사(시험지) 기능의 구조와 콘텐츠 작성 원칙
metadata:
  type: project
---

모의고사 기능(2026-07-06 추가). 학습 레슨과 완전히 분리된 "실전 시험지".

**구조:** `content/exams.ts`에 3회차, 각 회차 = 학습 5개 테마(levelId: l-basics/l-tax/l-invest/l-macro/l-housing) × 3문항 = 15문항. 채점·저장은 `lib/exams.ts`(순수) + `store/useExams.ts`(회차별 최고점, localStorage `donpath:exams:v1`). UI는 `components/exam/`(ExamList=허브, ExamSheet=몰입형 시험지+결과, ExamQuestionCard=출제/해설 겸용). 라우트 `/exams`(허브), `/exams/[examId]`(몰입형). `content.test.ts`가 구조·품질을 강제.

**콘텐츠 작성 원칙(회차 추가 시 반드시 지킬 것):**
- 유형은 **4지선다(choice, 보기 정확히 4개)·단답형(fill)만**. OX 금지(시험 느낌 위해). content.test.ts가 검증.
- **문제만 보고 풀리는 자족형** — 레슨을 안 봤어도 지문만으로 답 가능.
- **중급 난이도**. "초등학생 같은 뻔한 문제" 절대 지양(사용자 명시 요구).
- **매년 바뀌는 세율/한도 수치 하드코딩 회피** — 계산문제는 지문에 숫자를 담고(예: 72의 법칙, 복리), 개념·원리 위주로.
- 종목 추천·투자 조언 금지(프로젝트 불변 원칙 유지). 톤은 [[feedback-personalization-tone]]와 별개로, 해설은 친근하되 문항은 시험답게.
- 학습 진도/XP/스트릭을 건드리지 않음(성적은 useExams에만).
