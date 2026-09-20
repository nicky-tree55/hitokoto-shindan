import type { Genre } from "@hitokoto-shindan/domain";

/**
 * GenreRepository: Genreの永続化・取得を担うRepositoryのinterface。
 * 実装(インフラ層)はapplicationの外側(将来のinfrastructure層)に置く。
 */
export interface GenreRepository {
  findById(id: string): Promise<Genre | undefined>;
  findAll(): Promise<readonly Genre[]>;
}
