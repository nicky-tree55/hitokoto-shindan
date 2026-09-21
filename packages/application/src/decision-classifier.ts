import type { ClassificationResult } from "@hitokoto-shindan/domain";

/**
 * DecisionClassifier: フリーテキストの回答から診断結果(ClassificationResult)を導く分類ロジックのinterface。
 * 具体的な分類アルゴリズム（Jevによる自然文解釈等）の実装は将来のinfrastructure層に置く。
 */
export interface DecisionClassifier {
  classify(answerText: string): Promise<ClassificationResult> | ClassificationResult;
}
