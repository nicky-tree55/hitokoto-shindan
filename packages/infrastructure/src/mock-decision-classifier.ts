import type { DecisionClassifier } from "@hitokoto-shindan/application";
import type { Answer, ClassificationResult, Type } from "@hitokoto-shindan/domain";
import { createClassificationResult } from "@hitokoto-shindan/domain";

/**
 * MockDecisionClassifier: Jevによる実際の分類ロジックが実装されるまでの間、
 * 常に固定のClassificationResultを返すダミーのDecisionClassifier実装。
 * 入力(answers)の内容には依存しない。
 */
export class MockDecisionClassifier implements DecisionClassifier {
  constructor(
    private readonly fixedType: Type,
    private readonly fixedScore: number = 1,
  ) {}

  classify(_answers: readonly Answer[]): ClassificationResult {
    return createClassificationResult({ type: this.fixedType, score: this.fixedScore });
  }
}
