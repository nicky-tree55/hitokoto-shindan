import {
  createGenre,
  createQuestion,
  createType,
  type Genre,
  type Question,
  type Type,
} from "@hitokoto-shindan/domain";

/**
 * mock-data: Jevによる実際の分類ロジックが実装されるまでの間、疎通確認用に用意する
 * ハードコードされたGenre/Type/Questionのデータ。単一ジャンル（性格診断）・単一の質問のみを対象とする。
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

export const mockQuestion: Question = createQuestion({
  id: "q1",
  genreId: mockGenre.id,
  text: "最近あった出来事について、そのときどう考えて行動したか自由に教えてください。",
});
