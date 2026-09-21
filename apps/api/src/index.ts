/**
 * hitokoto-shindan API Worker
 *
 * - Run `bun run dev` in this directory to start a local dev server (wrangler dev)
 * - Run `bun run deploy` to publish this worker
 *
 * Bind resources to this worker in `wrangler.jsonc`. After adding bindings, regenerate
 * the `Env` type with `bun run cf-typegen`.
 */
import { ClassifyAnswerUseCase } from "@hitokoto-shindan/application";
import {
  parseDiagnoseRequest,
  parseDiagnoseResponse,
  parseGenresResponse,
  parseHealthResponse,
  parseQuestionResponse,
} from "@hitokoto-shindan/contracts";
import {
  InMemoryGenreRepository,
  InMemoryQuestionRepository,
  MockDecisionClassifier,
  mockGenre,
  mockQuestion,
  mockTypes,
} from "@hitokoto-shindan/infrastructure";

// Jevによる実際の分類ロジックが実装されるまでの間、モック実装で疎通を確認する。
const genreRepository = new InMemoryGenreRepository([mockGenre]);
const questionRepository = new InMemoryQuestionRepository([mockQuestion]);
const classifier = new MockDecisionClassifier(mockTypes[0]);
const classifyAnswerUseCase = new ClassifyAnswerUseCase(
  genreRepository,
  questionRepository,
  classifier,
);

const CORS_HEADERS: Readonly<Record<string, string>> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function withCors(response: Response): Response {
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(CORS_HEADERS)) {
    headers.set(key, value);
  }
  return new Response(response.body, { status: response.status, headers });
}

const GENRE_QUESTION_PATTERN = /^\/genres\/([^/]+)\/question$/;
const GENRE_DIAGNOSE_PATTERN = /^\/genres\/([^/]+)\/diagnose$/;

export default {
  async fetch(request, _env, _ctx): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return withCors(new Response(null, { status: 204 }));
    }

    if (request.method === "GET" && url.pathname === "/health") {
      const body = parseHealthResponse({ status: "ok" });
      return withCors(Response.json(body));
    }

    if (request.method === "GET" && url.pathname === "/genres") {
      const genres = await genreRepository.findAll();
      const body = parseGenresResponse({ genres });
      return withCors(Response.json(body));
    }

    const questionMatch = url.pathname.match(GENRE_QUESTION_PATTERN);
    if (request.method === "GET" && questionMatch) {
      const genreId = decodeURIComponent(questionMatch[1]);
      const genre = await genreRepository.findById(genreId);
      if (!genre) {
        return withCors(new Response("Not Found", { status: 404 }));
      }

      const question = await questionRepository.findByGenreId(genreId);
      if (!question) {
        return withCors(new Response("Not Found", { status: 404 }));
      }

      const body = parseQuestionResponse({ question });
      return withCors(Response.json(body));
    }

    const diagnoseMatch = url.pathname.match(GENRE_DIAGNOSE_PATTERN);
    if (request.method === "POST" && diagnoseMatch) {
      const genreId = decodeURIComponent(diagnoseMatch[1]);

      let diagnoseRequest: ReturnType<typeof parseDiagnoseRequest>;
      try {
        diagnoseRequest = parseDiagnoseRequest(await request.json());
      } catch {
        return withCors(new Response("Bad Request", { status: 400 }));
      }

      try {
        const question = await questionRepository.findByGenreId(genreId);
        if (!question || question.id !== diagnoseRequest.questionId) {
          return withCors(new Response("Not Found", { status: 404 }));
        }

        const result = await classifyAnswerUseCase.execute(genreId, diagnoseRequest.answerText);
        const body = parseDiagnoseResponse(result);
        return withCors(Response.json(body));
      } catch {
        return withCors(new Response("Not Found", { status: 404 }));
      }
    }

    return withCors(new Response("Not Found", { status: 404 }));
  },
} satisfies ExportedHandler<Env>;
