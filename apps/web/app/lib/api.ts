import {
  type DiagnoseRequest,
  type DiagnoseResponse,
  parseDiagnoseResponse,
  parseGenresResponse,
  parseQuestionResponse,
  type Question,
} from "@hitokoto-shindan/contracts";

/**
 * DEFAULT_API_BASE_URL: NEXT_PUBLIC_API_BASE_URL が未設定の場合に使う、
 * ローカル開発時の apps/api (wrangler dev) のデフォルトURL。
 */
export const DEFAULT_API_BASE_URL = "http://localhost:8787";

/**
 * apps/api のベースURLを環境変数から取得する。
 * apps/web は静的export（Cloudflare Pages配信）のためサーバーサイド実行を持たず、
 * apps/api への通信はすべてブラウザから行う。そのためNEXT_PUBLIC_ prefixの変数を使う。
 */
export function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || DEFAULT_API_BASE_URL;
}

/**
 * 診断対象のGenreと、その唯一の質問（フリーテキスト回答を前提とする1問）をまとめて取得する。
 */
export async function fetchGenreAndQuestion(): Promise<{ genreId: string; question: Question }> {
  const apiBaseUrl = getApiBaseUrl();

  const genresRes = await fetch(`${apiBaseUrl}/genres`);
  if (!genresRes.ok) {
    throw new Error(`Failed to load genres: ${genresRes.status}`);
  }
  const { genres } = parseGenresResponse(await genresRes.json());
  const genre = genres[0];
  if (!genre) {
    throw new Error("No genre is available");
  }

  const questionRes = await fetch(`${apiBaseUrl}/genres/${genre.id}/question`);
  if (!questionRes.ok) {
    throw new Error(`Failed to load question: ${questionRes.status}`);
  }
  const { question } = parseQuestionResponse(await questionRes.json());

  return { genreId: genre.id, question };
}

/**
 * questionId/answerTextから、POST /genres/:id/diagnose のリクエストボディを組み立てる。
 */
export function buildDiagnoseRequestBody(questionId: string, answerText: string): DiagnoseRequest {
  return { questionId, answerText };
}

/**
 * apps/api の POST /genres/:id/diagnose を呼び出し、診断結果を返す。
 */
export async function postDiagnose(
  genreId: string,
  questionId: string,
  answerText: string,
): Promise<DiagnoseResponse> {
  const apiBaseUrl = getApiBaseUrl();

  const response = await fetch(`${apiBaseUrl}/genres/${genreId}/diagnose`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(buildDiagnoseRequestBody(questionId, answerText)),
  });
  if (!response.ok) {
    throw new Error(`Failed to diagnose: ${response.status}`);
  }

  return parseDiagnoseResponse(await response.json());
}
