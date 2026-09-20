/**
 * hitokoto-shindan API Worker
 *
 * - Run `bun run dev` in this directory to start a local dev server (wrangler dev)
 * - Run `bun run deploy` to publish this worker
 *
 * Bind resources to this worker in `wrangler.jsonc`. After adding bindings, regenerate
 * the `Env` type with `bun run cf-typegen`.
 */
import { parseHealthResponse } from "@hitokoto-shindan/contracts";

export default {
  async fetch(request, _env, _ctx): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/health") {
      const body = parseHealthResponse({ status: "ok" });
      return Response.json(body);
    }

    return new Response("Not Found", { status: 404 });
  },
} satisfies ExportedHandler<Env>;
