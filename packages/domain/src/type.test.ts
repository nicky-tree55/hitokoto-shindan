import { describe, expect, it } from "bun:test";
import { createType } from "./type";

describe("createType", () => {
  it("creates a Type with trimmed fields", () => {
    const type = createType({
      id: " leader ",
      genreId: " personality ",
      name: " 情熱的リーダー型 ",
      description: " 周囲を巻き込みながら先頭に立つタイプ ",
    });

    expect(type).toEqual({
      id: "leader",
      genreId: "personality",
      name: "情熱的リーダー型",
      description: "周囲を巻き込みながら先頭に立つタイプ",
    });
  });

  it.each([
    ["id", { id: "  ", genreId: "personality", name: "リーダー型", description: "説明" }],
    ["genreId", { id: "leader", genreId: "  ", name: "リーダー型", description: "説明" }],
    ["name", { id: "leader", genreId: "personality", name: "  ", description: "説明" }],
    [
      "description",
      { id: "leader", genreId: "personality", name: "リーダー型", description: "  " },
    ],
  ] as const)("throws when %s is empty", (field, input) => {
    expect(() => createType(input)).toThrow(`Type.${field} must not be empty`);
  });
});
