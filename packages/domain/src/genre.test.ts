import { describe, expect, it } from "bun:test";
import { createGenre } from "./genre";

describe("createGenre", () => {
  it("creates a Genre with trimmed id/name", () => {
    const genre = createGenre({ id: " personality ", name: " 性格診断 " });

    expect(genre).toEqual({ id: "personality", name: "性格診断" });
  });

  it("throws when id is empty", () => {
    expect(() => createGenre({ id: "  ", name: "性格診断" })).toThrow("Genre.id must not be empty");
  });

  it("throws when name is empty", () => {
    expect(() => createGenre({ id: "personality", name: "  " })).toThrow(
      "Genre.name must not be empty",
    );
  });
});
