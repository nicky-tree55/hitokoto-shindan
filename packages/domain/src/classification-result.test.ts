import { describe, expect, it } from "bun:test";
import { createClassificationResult } from "./classification-result";
import { createType } from "./type";

describe("createClassificationResult", () => {
  const type = createType({
    id: "leader",
    genreId: "personality",
    name: "情熱的リーダー型",
    description: "周囲を巻き込みながら先頭に立つタイプ",
  });

  it("creates a ClassificationResult", () => {
    const result = createClassificationResult({ type, score: 3 });

    expect(result).toEqual({ type, score: 3 });
  });

  it("throws when score is negative", () => {
    expect(() => createClassificationResult({ type, score: -1 })).toThrow(
      "ClassificationResult.score must not be negative",
    );
  });

  it("throws when score is not finite", () => {
    expect(() => createClassificationResult({ type, score: Number.NaN })).toThrow(
      "ClassificationResult.score must be a finite number",
    );
  });
});
