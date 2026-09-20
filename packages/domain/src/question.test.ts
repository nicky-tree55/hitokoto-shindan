import { describe, expect, it } from "bun:test";
import { createAnswer } from "./answer";
import { createQuestion } from "./question";

describe("createQuestion", () => {
  const answer = createAnswer({ id: "a1", text: "はい", typeId: "leader" });

  it("creates a Question with trimmed fields", () => {
    const question = createQuestion({
      id: " q1 ",
      genreId: " personality ",
      text: " 朝は得意ですか？ ",
      answers: [answer],
    });

    expect(question).toEqual({
      id: "q1",
      genreId: "personality",
      text: "朝は得意ですか？",
      answers: [answer],
    });
  });

  it("throws when answers is empty", () => {
    expect(() =>
      createQuestion({ id: "q1", genreId: "personality", text: "朝は得意ですか？", answers: [] }),
    ).toThrow("Question.answers must have at least one Answer");
  });

  it.each([
    ["id", { id: "  ", genreId: "personality", text: "質問", answers: [answer] }],
    ["genreId", { id: "q1", genreId: "  ", text: "質問", answers: [answer] }],
    ["text", { id: "q1", genreId: "personality", text: "  ", answers: [answer] }],
  ] as const)("throws when %s is empty", (field, input) => {
    expect(() => createQuestion(input)).toThrow(`Question.${field} must not be empty`);
  });
});
