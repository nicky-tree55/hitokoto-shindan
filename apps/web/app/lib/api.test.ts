import { afterEach, describe, expect, it, mock } from "bun:test";
import { buildDiagnoseRequestBody, DEFAULT_API_BASE_URL, getApiBaseUrl } from "./api";

describe("getApiBaseUrl", () => {
  it("returns the default base URL when NEXT_PUBLIC_API_BASE_URL is not set", () => {
    const original = process.env.NEXT_PUBLIC_API_BASE_URL;
    delete process.env.NEXT_PUBLIC_API_BASE_URL;

    expect(getApiBaseUrl()).toBe(DEFAULT_API_BASE_URL);

    if (original !== undefined) {
      process.env.NEXT_PUBLIC_API_BASE_URL = original;
    }
  });

  it("returns the configured base URL when set", () => {
    const original = process.env.NEXT_PUBLIC_API_BASE_URL;
    process.env.NEXT_PUBLIC_API_BASE_URL = "https://api.example.com";

    expect(getApiBaseUrl()).toBe("https://api.example.com");

    if (original === undefined) {
      delete process.env.NEXT_PUBLIC_API_BASE_URL;
    } else {
      process.env.NEXT_PUBLIC_API_BASE_URL = original;
    }
  });
});

describe("buildDiagnoseRequestBody", () => {
  it("builds a diagnose request body from a questionId and answerText", () => {
    expect(buildDiagnoseRequestBody("q1", "朝から活動的に過ごしました。")).toEqual({
      questionId: "q1",
      answerText: "朝から活動的に過ごしました。",
    });
  });
});

describe("fetchGenreAndQuestion / postDiagnose", () => {
  afterEach(() => {
    mock.restore();
  });

  it("fetches the first genre and its single question", async () => {
    const { fetchGenreAndQuestion } = await import("./api");
    const fetchMock = mock(async (input: string | URL | Request) => {
      const url = String(input);
      if (url.endsWith("/genres")) {
        return Response.json({ genres: [{ id: "personality", name: "性格診断" }] });
      }
      if (url.endsWith("/genres/personality/question")) {
        return Response.json({
          question: { id: "q1", genreId: "personality", text: "質問文" },
        });
      }
      throw new Error(`Unexpected fetch: ${url}`);
    });
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    const result = await fetchGenreAndQuestion();

    expect(result).toEqual({
      genreId: "personality",
      question: { id: "q1", genreId: "personality", text: "質問文" },
    });
  });

  it("posts a diagnose request and returns the parsed response", async () => {
    const { postDiagnose } = await import("./api");
    const fetchMock = mock(async () =>
      Response.json({
        type: { id: "leader", genreId: "personality", name: "リーダー型", description: "説明" },
        score: 1,
      }),
    );
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    const result = await postDiagnose("personality", "q1", "回答テキスト");

    expect(result.type.id).toBe("leader");
    expect(result.score).toBe(1);
  });
});
