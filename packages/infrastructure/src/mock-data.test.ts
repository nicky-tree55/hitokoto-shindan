import { describe, expect, it } from "bun:test";
import { mockGenre, mockQuestions } from "./mock-data";

describe("mock-data", () => {
  it("defines a single hardcoded genre", () => {
    expect(mockGenre.id).toBe("personality");
  });

  it("defines questions that all belong to the mock genre", () => {
    expect(mockQuestions.length).toBeGreaterThan(0);
    for (const question of mockQuestions) {
      expect(question.genreId).toBe(mockGenre.id);
      expect(question.answers.length).toBeGreaterThan(0);
    }
  });
});
