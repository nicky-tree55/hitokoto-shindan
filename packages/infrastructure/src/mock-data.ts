import {
  type Answer,
  createAnswer,
  createGenre,
  createQuestion,
  createType,
  type Genre,
  type Question,
  type Type,
} from "@hitokoto-shindan/domain";

/**
 * mock-data: Jevによる実際の分類ロジックが実装されるまでの間、疎通確認用に用意する
 * ハードコードされたGenre/Type/Questionのデータ。単一ジャンル（性格診断）のみを対象とする。
 */

export const mockGenre: Genre = createGenre({ id: "personality", name: "性格診断" });

export const mockTypes: readonly Type[] = [
  createType({
    id: "leader",
    genreId: mockGenre.id,
    name: "情熱的リーダー型",
    description: "周囲を巻き込みながら先頭に立ち、物事を前進させるタイプ。",
  }),
  createType({
    id: "supporter",
    genreId: mockGenre.id,
    name: "縁の下の支え型",
    description: "周囲をよく観察し、着実に他者を支えることを得意とするタイプ。",
  }),
];

function createMockAnswers(
  questionId: string,
  leaderText: string,
  supporterText: string,
): readonly Answer[] {
  return [
    createAnswer({ id: `${questionId}-leader`, text: leaderText, typeId: "leader" }),
    createAnswer({ id: `${questionId}-supporter`, text: supporterText, typeId: "supporter" }),
  ];
}

export const mockQuestions: readonly Question[] = [
  createQuestion({
    id: "q1",
    genreId: mockGenre.id,
    text: "新しい企画では、まず何をしますか？",
    answers: createMockAnswers(
      "q1",
      "率先してみんなに声をかける",
      "困っている人がいないか確認する",
    ),
  }),
  createQuestion({
    id: "q2",
    genreId: mockGenre.id,
    text: "グループ作業での役割は？",
    answers: createMockAnswers("q2", "方向性を決めて引っ張る", "細部を整えて支える"),
  }),
  createQuestion({
    id: "q3",
    genreId: mockGenre.id,
    text: "休日の過ごし方は？",
    answers: createMockAnswers("q3", "新しい場所に出かける", "落ち着いて計画を立てる"),
  }),
];
