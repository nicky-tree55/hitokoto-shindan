import { describe, expect, it } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { GenreSelect } from "./genre-select";

describe("GenreSelect", () => {
  it("renders all genre chips with their labels", () => {
    const html = renderToStaticMarkup(<GenreSelect onSelect={() => {}} />);

    for (const label of ["動物", "恋愛", "性格", "仕事", "RPG", "天気", "色", "その他"]) {
      expect(html).toContain(label);
    }
  });
});
