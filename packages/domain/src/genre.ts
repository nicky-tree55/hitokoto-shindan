/**
 * Genre: 診断のジャンル（例:「性格診断」「相性診断」）を表す値オブジェクト。
 */
export interface Genre {
  readonly id: string;
  readonly name: string;
}

export interface CreateGenreInput {
  readonly id: string;
  readonly name: string;
}

/**
 * バリデーション付きファクトリ関数。
 * id/nameが空文字（前後空白のみを含む）の場合はエラーを投げる。
 */
export function createGenre(input: CreateGenreInput): Genre {
  const id = input.id.trim();
  const name = input.name.trim();

  if (id.length === 0) {
    throw new Error("Genre.id must not be empty");
  }
  if (name.length === 0) {
    throw new Error("Genre.name must not be empty");
  }

  return { id, name };
}
