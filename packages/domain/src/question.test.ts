import { describe, expect, it } from "bun:test";
import { createQuestion } from "./question";

describe("createQuestion", () => {
  it("creates a Question with trimmed fields", () => {
    const question = createQuestion({
      id: " q1 ",
      genreId: " personality ",
      text: " 朝は得意ですか？ ",
    });

    expect(question).toEqual({
      id: "q1",
      genreId: "personality",
      text: "朝は得意ですか？",
    });
  });

  it.each([
    ["id", { id: "  ", genreId: "personality", text: "質問" }],
    ["genreId", { id: "q1", genreId: "  ", text: "質問" }],
    ["text", { id: "q1", genreId: "personality", text: "  " }],
  ] as const)("throws when %s is empty", (field, input) => {
    expect(() => createQuestion(input)).toThrow(`Question.${field} must not be empty`);
  });
});
