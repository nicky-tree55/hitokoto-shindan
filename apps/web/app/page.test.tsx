import { describe, expect, it } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import Home from "./page";

describe("Home page", () => {
  it("renders the initial loading state before genre/question data arrives", () => {
    const html = renderToStaticMarkup(<Home />);

    expect(html).toContain("質問を読み込み中です");
  });
});
