import * as v from "valibot";

/**
 * QuestionSchema: あるGenreに属する質問を表すレスポンス用スキーマ。
 * フリーテキストで回答されることを前提とし、選択式のAnswerは持たない。
 */
export const QuestionSchema = v.object({
  id: v.string(),
  genreId: v.string(),
  text: v.string(),
});

export type Question = v.InferOutput<typeof QuestionSchema>;

/**
 * QuestionResponseSchema: apps/api の GET /genres/:id/question エンドポイントのレスポンス形式。
 * Genreにつき質問は1問のみのため単数形で返す。
 */
export const QuestionResponseSchema = v.object({
  question: QuestionSchema,
});

export type QuestionResponse = v.InferOutput<typeof QuestionResponseSchema>;

/**
 * QuestionResponseSchemaに基づいて入力を検証し、検証済みのQuestionResponseを返す。
 */
export function parseQuestionResponse(input: unknown): QuestionResponse {
  return v.parse(QuestionResponseSchema, input);
}
