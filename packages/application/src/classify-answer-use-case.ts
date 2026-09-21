import type { ClassificationResult } from "@hitokoto-shindan/domain";
import type { DecisionClassifier } from "./decision-classifier";
import type { GenreRepository } from "./genre-repository";
import type { QuestionRepository } from "./question-repository";

/**
 * ClassifyAnswerUseCase: 質問1問・フリーテキスト回答から診断結果を導くUseCase。
 * GenreRepository/QuestionRepository/DecisionClassifierを組み合わせ、
 * 指定されたGenreの質問に対する回答テキストから診断結果を導く一連の流れを示す。
 */
export class ClassifyAnswerUseCase {
  constructor(
    private readonly genreRepository: GenreRepository,
    private readonly questionRepository: QuestionRepository,
    private readonly classifier: DecisionClassifier,
  ) {}

  async execute(genreId: string, answerText: string): Promise<ClassificationResult> {
    const genre = await this.genreRepository.findById(genreId);
    if (!genre) {
      throw new Error(`Genre not found: ${genreId}`);
    }

    // Genreに紐づくQuestionが存在することを確認し、Repository層との疎通を示す。
    const question = await this.questionRepository.findByGenreId(genreId);
    if (!question) {
      throw new Error(`Question not found for genre: ${genreId}`);
    }

    return this.classifier.classify(answerText);
  }
}
