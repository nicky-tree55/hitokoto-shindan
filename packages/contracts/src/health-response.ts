import * as v from "valibot";

/**
 * HealthResponseSchema: apps/api の GET /health エンドポイントのレスポンス形式。
 * apps/api（サーバー側の検証）とapps/web（クライアント側の型利用）の双方で共有する。
 */
export const HealthResponseSchema = v.object({
  status: v.literal("ok"),
});

export type HealthResponse = v.InferOutput<typeof HealthResponseSchema>;

/**
 * HealthResponseSchemaに基づいて入力を検証し、検証済みのHealthResponseを返す。
 * apps/api側でレスポンスを送信する前の防御的なバリデーションに使う。
 */
export function parseHealthResponse(input: unknown): HealthResponse {
  return v.parse(HealthResponseSchema, input);
}
