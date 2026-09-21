import { describe, expect, it } from "bun:test";
import type { DiagnoseResponse } from "@hitokoto-shindan/contracts";
import { renderToStaticMarkup } from "react-dom/server";
import { ResultStep } from "./result-step";

const result: DiagnoseResponse = {
  type: {
    id: "leader",
    genreId: "personality",
    name: "情熱的リーダー型",
    description: "周囲を巻き込みながら先頭に立つタイプ。",
  },
  score: 0.8,
};

describe("ResultStep", () => {
  it("renders the diagnosis type name/description and a restart button", () => {
    const html = renderToStaticMarkup(<ResultStep result={result} onRestart={() => {}} />);

    expect(html).toContain(result.type.name);
    expect(html).toContain(result.type.description);
    expect(html).toContain("もう一度");
  });
});
