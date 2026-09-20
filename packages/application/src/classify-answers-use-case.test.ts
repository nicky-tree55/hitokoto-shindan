import { describe, expect, it } from "bun:test";
import {
  type Answer,
  type ClassificationResult,
  createAnswer,
  createClassificationResult,
  createGenre,
  createQuestion,
  createType,
  type Genre,
  type Question,
} from "@hitokoto-shindan/domain";
import { ClassifyAnswersUseCase } from "./classify-answers-use-case";
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
const answer: Answer = createAnswer({ id: "a1", text: "はい", typeId: type.id });
const question: Question = createQuestion({
  id: "q1",
  genreId: genre.id,
  text: "朝は得意ですか？",
  answers: [answer],
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
  constructor(private readonly questions: readonly Question[]) {}
  async findByGenreId(genreId: string): Promise<readonly Question[]> {
    return this.questions.filter((q) => q.genreId === genreId);
  }
}

class FakeDecisionClassifier implements DecisionClassifier {
  constructor(private readonly result: ClassificationResult) {}
  classify(): ClassificationResult {
    return this.result;
  }
}

describe("ClassifyAnswersUseCase", () => {
  it("delegates to the classifier once the genre is found", async () => {
    const expected = createClassificationResult({ type, score: 1 });
    const useCase = new ClassifyAnswersUseCase(
      new FakeGenreRepository([genre]),
      new FakeQuestionRepository([question]),
      new FakeDecisionClassifier(expected),
    );

    const result = await useCase.execute(genre.id, [answer]);

    expect(result).toEqual(expected);
  });

  it("throws when the genre does not exist", async () => {
    const useCase = new ClassifyAnswersUseCase(
      new FakeGenreRepository([]),
      new FakeQuestionRepository([]),
      new FakeDecisionClassifier(createClassificationResult({ type, score: 0 })),
    );

    await expect(useCase.execute("unknown", [answer])).rejects.toThrow("Genre not found: unknown");
  });
});
