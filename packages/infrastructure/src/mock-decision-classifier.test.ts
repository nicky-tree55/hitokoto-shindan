import { describe, expect, it } from "bun:test";
import { createType } from "@hitokoto-shindan/domain";
import { MockDecisionClassifier } from "./mock-decision-classifier";

const type = createType({
  id: "leader",
  genreId: "personality",
  name: "情熱的リーダー型",
  description: "説明文",
});

describe("MockDecisionClassifier", () => {
  it("always returns the fixed classification result regardless of input", () => {
    const classifier = new MockDecisionClassifier(type, 1);

    expect(classifier.classify("朝から活動的に過ごしました。")).toEqual({ type, score: 1 });
    expect(classifier.classify("")).toEqual({ type, score: 1 });
  });

  it("defaults the score to 1 when not specified", () => {
    const classifier = new MockDecisionClassifier(type);

    expect(classifier.classify("回答テキスト").score).toBe(1);
  });
});
