import { describe, expect, it } from "bun:test";
import {
  type ClassificationResult,
  createClassificationResult,
  createGenre,
  createQuestion,
  createType,
  type Genre,
  type Question,
} from "@hitokoto-shindan/domain";
import { ClassifyAnswerUseCase } from "./classify-answer-use-case";
import type { DecisionClassifier } from "./decision-classifier";
import type { GenreRepository } from "./genre-repository";
import type { QuestionRepository } from "./question-repository";

const genre: Genre = createGenre({ id: "personality", name: "性格診断" });
const type = createType({
  id: "leader",
  genreId: genre.id,
  name: "情熱的リーダー型",
  description: "周囲を巻き込みながら先頭に立つタイプ",
});
const question: Question = createQuestion({
  id: "q1",
  genreId: genre.id,
  text: "朝は得意ですか？",
});

class FakeGenreRepository implements GenreRepository {
  constructor(private readonly genres: readonly Genre[]) {}
  async findById(id: string): Promise<Genre | undefined> {
    return this.genres.find((g) => g.id === id);
  }
  async findAll(): Promise<readonly Genre[]> {
    return this.genres;
  }
}

class FakeQuestionRepository implements QuestionRepository {
  constructor(private readonly question: Question | undefined) {}
  async findByGenreId(): Promise<Question | undefined> {
    return this.question;
  }
}

class FakeDecisionClassifier implements DecisionClassifier {
  constructor(private readonly result: ClassificationResult) {}
  classify(): ClassificationResult {
    return this.result;
  }
}

describe("ClassifyAnswerUseCase", () => {
  it("delegates to the classifier once the genre and question are found", async () => {
    const expected = createClassificationResult({ type, score: 1 });
    const useCase = new ClassifyAnswerUseCase(
      new FakeGenreRepository([genre]),
      new FakeQuestionRepository(question),
      new FakeDecisionClassifier(expected),
    );

    const result = await useCase.execute(genre.id, "朝からしっかり活動できます。");

    expect(result).toEqual(expected);
  });

  it("throws when the genre does not exist", async () => {
    const useCase = new ClassifyAnswerUseCase(
      new FakeGenreRepository([]),
      new FakeQuestionRepository(question),
      new FakeDecisionClassifier(createClassificationResult({ type, score: 0 })),
    );

    await expect(useCase.execute("unknown", "回答")).rejects.toThrow("Genre not found: unknown");
  });

  it("throws when the genre has no question", async () => {
    const useCase = new ClassifyAnswerUseCase(
      new FakeGenreRepository([genre]),
      new FakeQuestionRepository(undefined),
      new FakeDecisionClassifier(createClassificationResult({ type, score: 0 })),
    );

    await expect(useCase.execute(genre.id, "回答")).rejects.toThrow(
      `Question not found for genre: ${genre.id}`,
    );
  });
});
