import type { QuestionRepository } from "@hitokoto-shindan/application";
import type { Question } from "@hitokoto-shindan/domain";

/**
 * InMemoryQuestionRepository: ハードコードされたQuestion一覧を保持するQuestionRepositoryのモック実装。
 */
export class InMemoryQuestionRepository implements QuestionRepository {
  constructor(private readonly questions: readonly Question[]) {}

  async findByGenreId(genreId: string): Promise<readonly Question[]> {
    return this.questions.filter((question) => question.genreId === genreId);
  }
}
