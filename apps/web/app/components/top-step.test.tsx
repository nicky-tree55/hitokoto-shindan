import { describe, expect, it } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { TopStep } from "./top-step";

describe("TopStep", () => {
  it("renders the headline, free-input form, and genre selection chips", () => {
    const html = renderToStaticMarkup(<TopStep formAction={() => {}} onSelectGenre={() => {}} />);

    expect(html).toContain("考えていることを");
    expect(html).toContain("選べるジャンル");
    expect(html).toContain("動物");
    expect(html).toContain("その他");
  });

  it("renders the error message when provided", () => {
    const html = renderToStaticMarkup(
      <TopStep formAction={() => {}} onSelectGenre={() => {}} errorMessage="失敗しました" />,
    );

    expect(html).toContain("失敗しました");
  });
});
