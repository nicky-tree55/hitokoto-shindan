import * as v from "valibot";

/**
 * GenreSchema: 診断のジャンル（例:「性格診断」）を表すレスポンス用スキーマ。
 */
export const GenreSchema = v.object({
  id: v.string(),
  name: v.string(),
});

export type Genre = v.InferOutput<typeof GenreSchema>;

/**
 * GenresResponseSchema: apps/api の GET /genres エンドポイントのレスポンス形式。
 */
export const GenresResponseSchema = v.object({
  genres: v.array(GenreSchema),
});

export type GenresResponse = v.InferOutput<typeof GenresResponseSchema>;

/**
 * GenresResponseSchemaに基づいて入力を検証し、検証済みのGenresResponseを返す。
 */
export function parseGenresResponse(input: unknown): GenresResponse {
  return v.parse(GenresResponseSchema, input);
}
