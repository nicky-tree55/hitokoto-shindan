import type { QuestionRepository } from "@hitokoto-shindan/application";
import type { Question } from "@hitokoto-shindan/domain";

/**
 * InMemoryQuestionRepository: ハードコードされたQuestion一覧を保持するQuestionRepositoryのモック実装。
 * Genreにつき質問は1問のみを想定する。
 */
export class InMemoryQuestionRepository implements QuestionRepository {
  constructor(private readonly questions: readonly Question[]) {}

  async findByGenreId(genreId: string): Promise<Question | undefined> {
    return this.questions.find((question) => question.genreId === genreId);
  }
}
