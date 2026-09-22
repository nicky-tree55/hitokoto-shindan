import { describe, expect, it } from "bun:test";
import type { DiagnoseResponse } from "@hitokoto-shindan/contracts";
import { renderToStaticMarkup } from "react-dom/server";
import { ResultStep, shareResult } from "./result-step";

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
  it("renders the diagnosis type name/description and restart/share buttons", () => {
    const html = renderToStaticMarkup(<ResultStep result={result} onRestart={() => {}} />);

    expect(html).toContain(result.type.name);
    expect(html).toContain(result.type.description);
    expect(html).toContain("もう一度");
    expect(html).toContain("シェアする");
  });
});

describe("shareResult", () => {
  it("uses the Web Share API when available", async () => {
    let sharedWith: { text: string; url?: string } | undefined;

    const outcome = await shareResult(result, {
      share: async (data) => {
        sharedWith = data;
      },
      url: "https://example.com/",
    });

    expect(outcome).toBe("shared");
    expect(sharedWith?.text).toContain(result.type.name);
    expect(sharedWith?.url).toBe("https://example.com/");
  });

  it("returns cancelled when the user dismisses the share sheet", async () => {
    const outcome = await shareResult(result, {
      share: async () => {
        throw new Error("AbortError");
      },
    });

    expect(outcome).toBe("cancelled");
  });

  it("falls back to clipboard copy when Web Share API is unavailable", async () => {
    let copiedText: string | undefined;

    const outcome = await shareResult(result, {
      writeText: async (text) => {
        copiedText = text;
      },
      url: "https://example.com/",
    });

    expect(outcome).toBe("copied");
    expect(copiedText).toContain(result.type.name);
    expect(copiedText).toContain("https://example.com/");
  });

  it("returns error when clipboard copy fails", async () => {
    const outcome = await shareResult(result, {
      writeText: async () => {
        throw new Error("denied");
      },
    });

    expect(outcome).toBe("error");
  });

  it("returns unsupported when neither API is available", async () => {
    const outcome = await shareResult(result, {});

    expect(outcome).toBe("unsupported");
  });
});
