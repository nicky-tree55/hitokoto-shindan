import { describe, expect, it } from "bun:test";
import { mockGenre, mockQuestion } from "./mock-data";

describe("mock-data", () => {
  it("defines a single hardcoded genre", () => {
    expect(mockGenre.id).toBe("personality");
  });

  it("defines a single free-text question belonging to the mock genre", () => {
    expect(mockQuestion.genreId).toBe(mockGenre.id);
    expect(mockQuestion.text.length).toBeGreaterThan(0);
  });
});
