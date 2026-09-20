import type { Question } from "@hitokoto-shindan/domain";

/**
 * QuestionRepository: 特定のGenreに属するQuestionの取得を担うRepositoryのinterface。
 */
export interface QuestionRepository {
  findByGenreId(genreId: string): Promise<readonly Question[]>;
}
