/**
 * Type: 診断結果として提示される「型」（例:「情熱的リーダー型」）を表す値オブジェクト。
 * 必ずいずれかのGenreに属する。
 */
export interface Type {
  readonly id: string;
  readonly genreId: string;
  readonly name: string;
  readonly description: string;
}

export interface CreateTypeInput {
  readonly id: string;
  readonly genreId: string;
  readonly name: string;
  readonly description: string;
}

export function createType(input: CreateTypeInput): Type {
  const id = input.id.trim();
  const genreId = input.genreId.trim();
  const name = input.name.trim();
  const description = input.description.trim();

  if (id.length === 0) {
    throw new Error("Type.id must not be empty");
  }
  if (genreId.length === 0) {
    throw new Error("Type.genreId must not be empty");
  }
  if (name.length === 0) {
    throw new Error("Type.name must not be empty");
  }
  if (description.length === 0) {
    throw new Error("Type.description must not be empty");
  }

  return { id, genreId, name, description };
}
