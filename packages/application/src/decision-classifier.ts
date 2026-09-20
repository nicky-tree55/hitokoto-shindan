import type { Answer, ClassificationResult } from "@hitokoto-shindan/domain";

/**
 * DecisionClassifier: 回答一覧から診断結果(ClassificationResult)を導く分類ロジックのinterface。
 * 具体的な分類アルゴリズム（スコアリング方式等）の実装は将来のinfrastructure/application実装層に置く。
 */
export interface DecisionClassifier {
  classify(answers: readonly Answer[]): Promise<ClassificationResult> | ClassificationResult;
}
