import * as v from "valibot";

/**
 * DiagnoseRequestSchema: apps/api の POST /genres/:id/diagnose エンドポイントのリクエストボディ形式。
 * 質問は1問・回答はフリーテキストのため、どの質問(questionId)に対する自由記述回答(answerText)かを表す。
 */
export const DiagnoseRequestSchema = v.object({
  questionId: v.string(),
  answerText: v.pipe(v.string(), v.minLength(1)),
});

export type DiagnoseRequest = v.InferOutput<typeof DiagnoseRequestSchema>;

/**
 * DiagnoseRequestSchemaに基づいて入力を検証し、検証済みのDiagnoseRequestを返す。
 * apps/api側でリクエストボディを受け取った際の防御的なバリデーションに使う。
 */
export function parseDiagnoseRequest(input: unknown): DiagnoseRequest {
  return v.parse(DiagnoseRequestSchema, input);
}

/**
 * DiagnosisTypeSchema: 診断結果として提示される「型」を表すレスポンス用スキーマ。
 */
export const DiagnosisTypeSchema = v.object({
  id: v.string(),
  genreId: v.string(),
  name: v.string(),
  description: v.string(),
});

export type DiagnosisType = v.InferOutput<typeof DiagnosisTypeSchema>;

/**
 * DiagnoseResponseSchema: apps/api の POST /genres/:id/diagnose エンドポイントのレスポンス形式。
 */
export const DiagnoseResponseSchema = v.object({
  type: DiagnosisTypeSchema,
  score: v.number(),
});

export type DiagnoseResponse = v.InferOutput<typeof DiagnoseResponseSchema>;

/**
 * DiagnoseResponseSchemaに基づいて入力を検証し、検証済みのDiagnoseResponseを返す。
 */
export function parseDiagnoseResponse(input: unknown): DiagnoseResponse {
  return v.parse(DiagnoseResponseSchema, input);
}
