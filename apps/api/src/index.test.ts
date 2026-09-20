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
