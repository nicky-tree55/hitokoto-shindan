import { describe, expect, it } from "bun:test";
import * as v from "valibot";
import {
  AnswerSchema,
  parseQuestionsResponse,
  QuestionSchema,
  QuestionsResponseSchema,
} from "./question";

const validAnswer = { id: "a1", text: "はい", typeId: "type-1" };
const validQuestion = {
  id: "q1",
  genreId: "personality",
  text: "朝型ですか？",
  answers: [validAnswer],
};

describe("AnswerSchema", () => {
  it("accepts a valid answer", () => {
    expect(v.safeParse(AnswerSchema, validAnswer).success).toBe(true);
  });

  it.each([{ id: "a1", text: "はい" }, { text: "はい", typeId: "type-1" }, {}])(
    "rejects an invalid answer: %j",
    (input) => {
      expect(v.safeParse(AnswerSchema, input).success).toBe(false);
    },
  );
});

describe("QuestionSchema", () => {
  it("accepts a valid question", () => {
    expect(v.safeParse(QuestionSchema, validQuestion).success).toBe(true);
  });

  it("rejects a question without answers array", () => {
    const { answers: _answers, ...rest } = validQuestion;

    expect(v.safeParse(QuestionSchema, rest).success).toBe(false);
  });
});

describe("QuestionsResponseSchema", () => {
  it("accepts a valid questions response", () => {
    const result = v.safeParse(QuestionsResponseSchema, { questions: [validQuestion] });

    expect(result.success).toBe(true);
  });
});

describe("parseQuestionsResponse", () => {
  it("returns the parsed value for a valid input", () => {
    const input = { questions: [validQuestion] };

    expect(parseQuestionsResponse(input)).toEqual(input);
  });

  it("throws for an invalid input", () => {
    expect(() => parseQuestionsResponse({ questions: [{ id: "q1" }] })).toThrow();
  });
});
