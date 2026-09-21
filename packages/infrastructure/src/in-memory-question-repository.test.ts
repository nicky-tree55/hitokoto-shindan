import { describe, expect, it } from "bun:test";
import { createAnswer, createQuestion } from "@hitokoto-shindan/domain";
import { InMemoryQuestionRepository } from "./in-memory-question-repository";

const answer = createAnswer({ id: "a1", text: "はい", typeId: "type-1" });
const questionA = createQuestion({ id: "q1", genreId: "a", text: "質問A", answers: [answer] });
const questionB = createQuestion({ id: "q2", genreId: "b", text: "質問B", answers: [answer] });

describe("InMemoryQuestionRepository", () => {
  it("finds questions by genre id", async () => {
    const repository = new InMemoryQuestionRepository([questionA, questionB]);

    expect(await repository.findByGenreId("a")).toEqual([questionA]);
  });

  it("returns an empty array when no question matches the genre id", async () => {
    const repository = new InMemoryQuestionRepository([questionA]);

    expect(await repository.findByGenreId("unknown")).toEqual([]);
  });
});
