import { describe, expect, it } from "bun:test";
import * as v from "valibot";
import { GenreSchema, GenresResponseSchema, parseGenresResponse } from "./genre";

describe("GenreSchema", () => {
  it("accepts a valid genre", () => {
    const result = v.safeParse(GenreSchema, { id: "personality", name: "性格診断" });

    expect(result.success).toBe(true);
  });

  it.each([{ id: "personality" }, { name: "性格診断" }, {}, { id: 1, name: "性格診断" }])(
    "rejects an invalid genre: %j",
    (input) => {
      const result = v.safeParse(GenreSchema, input);

      expect(result.success).toBe(false);
    },
  );
});

describe("GenresResponseSchema", () => {
  it("accepts a valid genres response", () => {
    const result = v.safeParse(GenresResponseSchema, {
      genres: [{ id: "personality", name: "性格診断" }],
    });

    expect(result.success).toBe(true);
  });

  it("rejects a response without genres", () => {
    const result = v.safeParse(GenresResponseSchema, {});

    expect(result.success).toBe(false);
  });
});

describe("parseGenresResponse", () => {
  it("returns the parsed value for a valid input", () => {
    const input = { genres: [{ id: "personality", name: "性格診断" }] };

    expect(parseGenresResponse(input)).toEqual(input);
  });

  it("throws for an invalid input", () => {
    expect(() => parseGenresResponse({ genres: [{ id: "personality" }] })).toThrow();
  });
});
