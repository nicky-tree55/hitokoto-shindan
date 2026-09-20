import type { Type } from "./type";

/**
 * ClassificationResult: 回答一覧から導かれた診断の結果。
 * どのTypeに分類されたか、および分類の根拠となったスコアを保持する。
 */
export interface ClassificationResult {
  readonly type: Type;
  readonly score: number;
}

export interface CreateClassificationResultInput {
  readonly type: Type;
  readonly score: number;
}

export function createClassificationResult(
  input: CreateClassificationResultInput,
): ClassificationResult {
  if (!Number.isFinite(input.score)) {
    throw new Error("ClassificationResult.score must be a finite number");
  }
  if (input.score < 0) {
    throw new Error("ClassificationResult.score must not be negative");
  }

  return { type: input.type, score: input.score };
}
