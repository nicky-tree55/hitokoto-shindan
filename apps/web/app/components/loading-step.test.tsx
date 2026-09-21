import { describe, expect, it } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { LoadingStep } from "./loading-step";

describe("LoadingStep", () => {
  it("renders a lightweight waiting indicator without progress details", () => {
    const html = renderToStaticMarkup(<LoadingStep />);

    expect(html).toContain("診断中");
  });
});
