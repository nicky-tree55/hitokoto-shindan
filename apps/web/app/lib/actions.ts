import type { DiagnoseResponse } from "@hitokoto-shindan/contracts";
import { postDiagnose } from "./api";

/**
 * DiagnoseActionState: useActionStateで管理する送信状態。
 * フリーテキストの回答をapps/apiへ送信し、結果またはエラーメッセージを保持する。
 */
export type DiagnoseActionState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "done"; result: DiagnoseResponse };

export const initialDiagnoseActionState: DiagnoseActionState = { status: "idle" };

/**
 * diagnoseAction: 質問1問に対するフリーテキスト回答を送信する、useActionState用のクライアント側action。
 * apps/web は静的export（Server Actionを利用できない）のため、ブラウザから直接apps/apiを呼び出す
 * 通常の非同期関数として実装する。`diagnoseAction.bind(null, genreId, questionId)` の形でbindして使う。
 */
export async function diagnoseAction(
  genreId: string,
  questionId: string,
  _prevState: DiagnoseActionState,
  formData: FormData,
): Promise<DiagnoseActionState> {
  const answerText = String(formData.get("answerText") ?? "").trim();

  if (answerText.length === 0) {
    return { status: "error", message: "回答を入力してください" };
  }

  try {
    const result = await postDiagnose(genreId, questionId, answerText);
    return { status: "done", result };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { status: "error", message: `診断に失敗しました: ${message}` };
  }
}
