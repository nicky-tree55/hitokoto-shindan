import type { GenreRepository } from "@hitokoto-shindan/application";
import type { Genre } from "@hitokoto-shindan/domain";

/**
 * InMemoryGenreRepository: ハードコードされたGenre一覧を保持するGenreRepositoryのモック実装。
 * Jevによる実際の永続化層が実装されるまでの間、ローカルでの疎通確認に使う。
 */
export class InMemoryGenreRepository implements GenreRepository {
  constructor(private readonly genres: readonly Genre[]) {}

  async findById(id: string): Promise<Genre | undefined> {
    return this.genres.find((genre) => genre.id === id);
  }

  async findAll(): Promise<readonly Genre[]> {
    return this.genres;
  }
}
