import type { Question } from "@hitokoto-shindan/domain";

/**
 * QuestionRepository: 特定のGenreに属するQuestionの取得を担うRepositoryのinterface。
 * Genreにつき質問は1問のみのため、単一のQuestion（存在しない場合はundefined）を返す。
 */
export interface QuestionRepository {
  findByGenreId(genreId: string): Promise<Question | undefined>;
}
