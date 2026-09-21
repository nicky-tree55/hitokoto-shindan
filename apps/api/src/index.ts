/**
 * hitokoto-shindan API Worker
 *
 * - Run `bun run dev` in this directory to start a local dev server (wrangler dev)
 * - Run `bun run deploy` to publish this worker
 *
 * Bind resources to this worker in `wrangler.jsonc`. After adding bindings, regenerate
 * the `Env` type with `bun run cf-typegen`.
 */
import { ClassifyAnswersUseCase } from "@hitokoto-shindan/application";
import {
  parseDiagnoseRequest,
  parseDiagnoseResponse,
  parseGenresResponse,
  parseHealthResponse,
  parseQuestionsResponse,
} from "@hitokoto-shindan/contracts";
import type { Answer, Question } from "@hitokoto-shindan/domain";
import {
  InMemoryGenreRepository,
  InMemoryQuestionRepository,
  MockDecisionClassifier,
  mockGenre,
  mockQuestions,
  mockTypes,
} from "@hitokoto-shindan/infrastructure";

// Jevによる実際の分類ロジックが実装されるまでの間、モック実装で疎通を確認する。
const genreRepository = new InMemoryGenreRepository([mockGenre]);
const questionRepository = new InMemoryQuestionRepository(mockQuestions);
const classifier = new MockDecisionClassifier(mockTypes[0]);
const classifyAnswersUseCase = new ClassifyAnswersUseCase(
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

const GENRE_QUESTIONS_PATTERN = /^\/genres\/([^/]+)\/questions$/;
const GENRE_DIAGNOSE_PATTERN = /^\/genres\/([^/]+)\/diagnose$/;

/**
 * リクエストの回答一覧(questionId/answerId)を、質問データから引き当てて
 * ClassifyAnswersUseCaseが要求するdomainのAnswer一覧に変換する。
 * 存在しないquestionId/answerIdが指定された場合はErrorを投げる。
 */
function resolveAnswers(
  questions: readonly Question[],
  requested: readonly { questionId: string; answerId: string }[],
): Answer[] {
  return requested.map(({ questionId, answerId }) => {
    const question = questions.find((q) => q.id === questionId);
    const answer = question?.answers.find((a) => a.id === answerId);
    if (!answer) {
      throw new Error(`Unknown questionId/answerId: ${questionId}/${answerId}`);
    }
    return answer;
  });
}

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

    const questionsMatch = url.pathname.match(GENRE_QUESTIONS_PATTERN);
    if (request.method === "GET" && questionsMatch) {
      const genreId = decodeURIComponent(questionsMatch[1]);
      const genre = await genreRepository.findById(genreId);
      if (!genre) {
        return withCors(new Response("Not Found", { status: 404 }));
      }

      const questions = await questionRepository.findByGenreId(genreId);
      const body = parseQuestionsResponse({ questions });
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
        const questions = await questionRepository.findByGenreId(genreId);
        const answers = resolveAnswers(questions, diagnoseRequest.answers);
        const result = await classifyAnswersUseCase.execute(genreId, answers);
        const body = parseDiagnoseResponse(result);
        return withCors(Response.json(body));
      } catch {
        return withCors(new Response("Not Found", { status: 404 }));
      }
    }

    return withCors(new Response("Not Found", { status: 404 }));
  },
} satisfies ExportedHandler<Env>;
