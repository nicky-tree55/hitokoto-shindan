import { describe, expect, it } from "bun:test";
import * as v from "valibot";
import { parseQuestionResponse, QuestionResponseSchema, QuestionSchema } from "./question";

const validQuestion = {
  id: "q1",
  genreId: "personality",
  text: "朝型ですか？",
};

describe("QuestionSchema", () => {
  it("accepts a valid question", () => {
    expect(v.safeParse(QuestionSchema, validQuestion).success).toBe(true);
  });

  it.each([{ id: "q1" }, { id: "q1", genreId: "personality" }, {}])(
    "rejects an invalid question: %j",
    (input) => {
      expect(v.safeParse(QuestionSchema, input).success).toBe(false);
    },
  );
});

describe("QuestionResponseSchema", () => {
  it("accepts a valid question response", () => {
    const result = v.safeParse(QuestionResponseSchema, { question: validQuestion });

    expect(result.success).toBe(true);
  });
});

describe("parseQuestionResponse", () => {
  it("returns the parsed value for a valid input", () => {
    const input = { question: validQuestion };

    expect(parseQuestionResponse(input)).toEqual(input);
  });

  it("throws for an invalid input", () => {
    expect(() => parseQuestionResponse({ question: { id: "q1" } })).toThrow();
  });
});
