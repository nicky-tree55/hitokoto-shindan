import { describe, expect, it } from "bun:test";
import worker from "./index";

const env = {} as Env;
const ctx = {
  waitUntil: () => {},
  passThroughOnException: () => {},
  props: {},
} as unknown as ExecutionContext;

function toIncomingRequest(
  input: string,
  init?: RequestInit,
): Request<unknown, IncomingRequestCfProperties> {
  return new Request(input, init) as unknown as Request<unknown, IncomingRequestCfProperties>;
}

async function fetchFirstGenreId(): Promise<string> {
  const genresResponse = await worker.fetch(
    toIncomingRequest("http://example.com/genres"),
    env,
    ctx,
  );
  const { genres } = (await genresResponse.json()) as { genres: { id: string }[] };
  return genres[0].id;
}

describe("GET /health", () => {
  it("returns a validated ok response", async () => {
    const request = toIncomingRequest("http://example.com/health");

    const response = await worker.fetch(request, env, ctx);
    const body = (await response.json()) as { status: string };

    expect(response.status).toBe(200);
    expect(body).toEqual({ status: "ok" });
  });

  it("returns 404 for an unknown method", async () => {
    const request = toIncomingRequest("http://example.com/health", { method: "POST" });

    const response = await worker.fetch(request, env, ctx);

    expect(response.status).toBe(404);
  });

  it("returns 404 for an unknown path", async () => {
    const request = toIncomingRequest("http://example.com/unknown");

    const response = await worker.fetch(request, env, ctx);

    expect(response.status).toBe(404);
  });
});

describe("GET /genres", () => {
  it("returns the mock genre list", async () => {
    const request = toIncomingRequest("http://example.com/genres");

    const response = await worker.fetch(request, env, ctx);
    const body = (await response.json()) as { genres: { id: string; name: string }[] };

    expect(response.status).toBe(200);
    expect(body.genres.length).toBeGreaterThan(0);
  });
});

describe("GET /genres/:id/question", () => {
  it("returns the single free-text question for a known genre", async () => {
    const genreId = await fetchFirstGenreId();

    const response = await worker.fetch(
      toIncomingRequest(`http://example.com/genres/${genreId}/question`),
      env,
      ctx,
    );
    const body = (await response.json()) as { question: { id: string; text: string } };

    expect(response.status).toBe(200);
    expect(body.question.id).toBeTruthy();
    expect(body.question.text.length).toBeGreaterThan(0);
  });

  it("returns 404 for an unknown genre", async () => {
    const request = toIncomingRequest("http://example.com/genres/unknown/question");

    const response = await worker.fetch(request, env, ctx);

    expect(response.status).toBe(404);
  });
});

describe("POST /genres/:id/diagnose", () => {
  it("returns a fixed classification result for a valid request", async () => {
    const genreId = await fetchFirstGenreId();

    const questionResponse = await worker.fetch(
      toIncomingRequest(`http://example.com/genres/${genreId}/question`),
      env,
      ctx,
    );
    const { question } = (await questionResponse.json()) as { question: { id: string } };

    const request = toIncomingRequest(`http://example.com/genres/${genreId}/diagnose`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId: question.id, answerText: "朝から活動的に過ごしました。" }),
    });

    const response = await worker.fetch(request, env, ctx);
    const body = (await response.json()) as { type: { id: string }; score: number };

    expect(response.status).toBe(200);
    expect(body.type.id).toBeTruthy();
    expect(typeof body.score).toBe("number");
  });

  it("returns 404 for an unknown genre", async () => {
    const request = toIncomingRequest("http://example.com/genres/unknown/diagnose", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId: "q1", answerText: "回答" }),
    });

    const response = await worker.fetch(request, env, ctx);

    expect(response.status).toBe(404);
  });

  it("returns 404 when the questionId does not match the genre's question", async () => {
    const genreId = await fetchFirstGenreId();

    const request = toIncomingRequest(`http://example.com/genres/${genreId}/diagnose`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId: "unknown-question", answerText: "回答" }),
    });

    const response = await worker.fetch(request, env, ctx);

    expect(response.status).toBe(404);
  });

  it("returns 400 for an invalid request body", async () => {
    const genreId = await fetchFirstGenreId();

    const request = toIncomingRequest(`http://example.com/genres/${genreId}/diagnose`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId: "q1", answerText: "" }),
    });

    const response = await worker.fetch(request, env, ctx);

    expect(response.status).toBe(400);
  });
});

describe("OPTIONS (CORS preflight)", () => {
  it("returns 204 with CORS headers", async () => {
    const request = toIncomingRequest("http://example.com/genres", { method: "OPTIONS" });

    const response = await worker.fetch(request, env, ctx);

    expect(response.status).toBe(204);
    expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
  });
});
