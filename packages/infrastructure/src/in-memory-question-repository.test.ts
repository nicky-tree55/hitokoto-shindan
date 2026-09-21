import { describe, expect, it } from "bun:test";
import { createQuestion } from "@hitokoto-shindan/domain";
import { InMemoryQuestionRepository } from "./in-memory-question-repository";

const questionA = createQuestion({ id: "q1", genreId: "a", text: "質問A" });
const questionB = createQuestion({ id: "q2", genreId: "b", text: "質問B" });

describe("InMemoryQuestionRepository", () => {
  it("finds the question by genre id", async () => {
    const repository = new InMemoryQuestionRepository([questionA, questionB]);

    expect(await repository.findByGenreId("a")).toEqual(questionA);
  });

  it("returns undefined when no question matches the genre id", async () => {
    const repository = new InMemoryQuestionRepository([questionA]);

    expect(await repository.findByGenreId("unknown")).toBeUndefined();
  });
});
