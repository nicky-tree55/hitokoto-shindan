import * as v from "valibot";

/**
 * AnswerSchema: 質問(Question)に対する選択肢を表すレスポンス用スキーマ。
 */
export const AnswerSchema = v.object({
  id: v.string(),
  text: v.string(),
  typeId: v.string(),
});

export type Answer = v.InferOutput<typeof AnswerSchema>;

/**
 * QuestionSchema: あるGenreに属する質問を表すレスポンス用スキーマ。1つ以上のAnswerを持つ。
 */
export const QuestionSchema = v.object({
  id: v.string(),
  genreId: v.string(),
  text: v.string(),
  answers: v.array(AnswerSchema),
});

export type Question = v.InferOutput<typeof QuestionSchema>;

/**
 * QuestionsResponseSchema: apps/api の GET /genres/:id/questions エンドポイントのレスポンス形式。
 */
export const QuestionsResponseSchema = v.object({
  questions: v.array(QuestionSchema),
});

export type QuestionsResponse = v.InferOutput<typeof QuestionsResponseSchema>;

/**
 * QuestionsResponseSchemaに基づいて入力を検証し、検証済みのQuestionsResponseを返す。
 */
export function parseQuestionsResponse(input: unknown): QuestionsResponse {
  return v.parse(QuestionsResponseSchema, input);
}
