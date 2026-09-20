import type { Answer, ClassificationResult } from "@hitokoto-shindan/domain";
import type { DecisionClassifier } from "./decision-classifier";
import type { GenreRepository } from "./genre-repository";
import type { QuestionRepository } from "./question-repository";

/**
 * ClassifyAnswersUseCase: 疎通確認用の最小UseCase。
 * GenreRepository/QuestionRepository/DecisionClassifierを組み合わせ、
 * 指定されたGenreに対する回答一覧から診断結果を導く一連の流れを示す。
 */
export class ClassifyAnswersUseCase {
  constructor(
    private readonly genreRepository: GenreRepository,
    private readonly questionRepository: QuestionRepository,
    private readonly classifier: DecisionClassifier,
  ) {}

  async execute(genreId: string, answers: readonly Answer[]): Promise<ClassificationResult> {
    const genre = await this.genreRepository.findById(genreId);
    if (!genre) {
      throw new Error(`Genre not found: ${genreId}`);
    }

    // Genreに紐づくQuestionが存在することを確認し、Repository層との疎通を示す。
    await this.questionRepository.findByGenreId(genreId);

    return this.classifier.classify(answers);
  }
}
