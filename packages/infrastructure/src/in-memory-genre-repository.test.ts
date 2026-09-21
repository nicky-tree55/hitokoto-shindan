import { describe, expect, it } from "bun:test";
import { createGenre } from "@hitokoto-shindan/domain";
import { InMemoryGenreRepository } from "./in-memory-genre-repository";

const genreA = createGenre({ id: "a", name: "ジャンルA" });
const genreB = createGenre({ id: "b", name: "ジャンルB" });

describe("InMemoryGenreRepository", () => {
  it("finds a genre by id", async () => {
    const repository = new InMemoryGenreRepository([genreA, genreB]);

    expect(await repository.findById("a")).toEqual(genreA);
  });

  it("returns undefined when the genre does not exist", async () => {
    const repository = new InMemoryGenreRepository([genreA]);

    expect(await repository.findById("unknown")).toBeUndefined();
  });

  it("returns all genres", async () => {
    const repository = new InMemoryGenreRepository([genreA, genreB]);

    expect(await repository.findAll()).toEqual([genreA, genreB]);
  });
});
