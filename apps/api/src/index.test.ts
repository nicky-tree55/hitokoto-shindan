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

describe("GET /genres/:id/questions", () => {
  it("returns the questions for a known genre", async () => {
    const genresResponse = await worker.fetch(
      toIncomingRequest("http://example.com/genres"),
      env,
      ctx,
    );
    const { genres } = (await genresResponse.json()) as { genres: { id: string }[] };
    const genreId = genres[0].id;

    const response = await worker.fetch(
      toIncomingRequest(`http://example.com/genres/${genreId}/questions`),
      env,
      ctx,
    );
    const body = (await response.json()) as { questions: { id: string; answers: unknown[] }[] };

    expect(response.status).toBe(200);
    expect(body.questions.length).toBeGreaterThan(0);
  });

  it("returns 404 for an unknown genre", async () => {
    const request = toIncomingRequest("http://example.com/genres/unknown/questions");

    const response = await worker.fetch(request, env, ctx);

    expect(response.status).toBe(404);
  });
});

describe("POST /genres/:id/diagnose", () => {
  it("returns a fixed classification result for a valid request", async () => {
    const genresResponse = await worker.fetch(
      toIncomingRequest("http://example.com/genres"),
      env,
      ctx,
    );
    const { genres } = (await genresResponse.json()) as { genres: { id: string }[] };
    const genreId = genres[0].id;

    const questionsResponse = await worker.fetch(
      toIncomingRequest(`http://example.com/genres/${genreId}/questions`),
      env,
      ctx,
    );
    const { questions } = (await questionsResponse.json()) as {
      questions: { id: string; answers: { id: string }[] }[];
    };
    const answers = questions.map((q) => ({ questionId: q.id, answerId: q.answers[0].id }));

    const request = toIncomingRequest(`http://example.com/genres/${genreId}/diagnose`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers }),
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
      body: JSON.stringify({ answers: [] }),
    });

    const response = await worker.fetch(request, env, ctx);

    expect(response.status).toBe(404);
  });

  it("returns 400 for an invalid request body", async () => {
    const genresResponse = await worker.fetch(
      toIncomingRequest("http://example.com/genres"),
      env,
      ctx,
    );
    const { genres } = (await genresResponse.json()) as { genres: { id: string }[] };
    const genreId = genres[0].id;

    const request = toIncomingRequest(`http://example.com/genres/${genreId}/diagnose`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers: [{ questionId: "q1" }] }),
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
