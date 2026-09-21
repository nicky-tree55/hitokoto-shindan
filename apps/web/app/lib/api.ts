import type { DiagnoseRequest } from "@hitokoto-shindan/contracts";

/**
 * DEFAULT_API_BASE_URL: NEXT_PUBLIC_API_BASE_URL が未設定の場合に使う、
 * ローカル開発時の apps/api (wrangler dev) のデフォルトURL。
 */
export const DEFAULT_API_BASE_URL = "http://localhost:8787";

/**
 * apps/api のベースURLを環境変数から取得する。
 * ブラウザで動作するClient Componentから参照するため、NEXT_PUBLIC_ prefixの変数を使う。
 */
export function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || DEFAULT_API_BASE_URL;
}

/**
 * 質問ID→選択した回答IDのMapから、POST /genres/:id/diagnose のリクエストボディを組み立てる。
 */
export function buildDiagnoseRequestBody(
  selectedAnswerIdByQuestionId: ReadonlyMap<string, string>,
): DiagnoseRequest {
  return {
    answers: Array.from(selectedAnswerIdByQuestionId.entries()).map(([questionId, answerId]) => ({
      questionId,
      answerId,
    })),
  };
}
