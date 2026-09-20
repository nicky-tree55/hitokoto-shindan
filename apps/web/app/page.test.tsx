import { describe, expect, it } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import Home from "./page";

describe("Home page", () => {
  it("renders Hello World and One Line Diagnosis", () => {
    const html = renderToStaticMarkup(<Home />);

    expect(html).toContain("Hello World");
    expect(html).toContain("One Line Diagnosis");
  });
});
