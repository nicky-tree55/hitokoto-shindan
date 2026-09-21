import { describe, expect, it } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import Home from "./page";

describe("Home page", () => {
  it("renders the page title and the initial loading state", () => {
    const html = renderToStaticMarkup(<Home />);

    expect(html).toContain("One Line Diagnosis");
    expect(html).toContain("質問を読み込み中です");
  });
});
