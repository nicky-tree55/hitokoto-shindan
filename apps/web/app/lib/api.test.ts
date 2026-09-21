import { describe, expect, it } from "bun:test";
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
  it("converts a questionId->answerId map into a diagnose request body", () => {
    const selected = new Map([
      ["q1", "q1-leader"],
      ["q2", "q2-supporter"],
    ]);

    expect(buildDiagnoseRequestBody(selected)).toEqual({
      answers: [
        { questionId: "q1", answerId: "q1-leader" },
        { questionId: "q2", answerId: "q2-supporter" },
      ],
    });
  });

  it("returns an empty answers array for an empty map", () => {
    expect(buildDiagnoseRequestBody(new Map())).toEqual({ answers: [] });
  });
});
