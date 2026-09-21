"use client";

import {
  type DiagnoseResponse,
  parseDiagnoseResponse,
  parseGenresResponse,
  parseQuestionsResponse,
  type Question,
} from "@hitokoto-shindan/contracts";
import { useEffect, useState } from "react";
import { buildDiagnoseRequestBody, getApiBaseUrl } from "./lib/api";

type LoadState =
  | { status: "loading" }
  | { status: "ready"; genreId: string; questions: readonly Question[] }
  | { status: "error"; message: string };

type SubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "done"; result: DiagnoseResponse }
  | { status: "error"; message: string };

/**
 * DiagnosisForm: apps/api から質問一覧を取得し、回答フォームを表示、
 * 送信後にモックの診断結果を表示するClient Component。
 */
export default function DiagnosisForm() {
  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });
  const [answers, setAnswers] = useState<Map<string, string>>(new Map());
  const [submitState, setSubmitState] = useState<SubmitState>({ status: "idle" });

  useEffect(() => {
    let cancelled = false;
    const apiBaseUrl = getApiBaseUrl();

    async function load() {
      try {
        const genresRes = await fetch(`${apiBaseUrl}/genres`);
        if (!genresRes.ok) {
          throw new Error(`Failed to load genres: ${genresRes.status}`);
        }
        const { genres } = parseGenresResponse(await genresRes.json());
        const genre = genres[0];
        if (!genre) {
          throw new Error("No genre is available");
        }

        const questionsRes = await fetch(`${apiBaseUrl}/genres/${genre.id}/questions`);
        if (!questionsRes.ok) {
          throw new Error(`Failed to load questions: ${questionsRes.status}`);
        }
        const { questions } = parseQuestionsResponse(await questionsRes.json());

        if (!cancelled) {
          setLoadState({ status: "ready", genreId: genre.id, questions });
        }
      } catch (error) {
        if (!cancelled) {
          const message = error instanceof Error ? error.message : "Unknown error";
          setLoadState({ status: "error", message });
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loadState.status === "loading") {
    return <p>質問を読み込み中です...</p>;
  }

  if (loadState.status === "error") {
    return <p role="alert">質問の読み込みに失敗しました: {loadState.message}</p>;
  }

  const { genreId, questions } = loadState;
  const allAnswered = questions.every((question) => answers.has(question.id));

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitState({ status: "submitting" });

    try {
      const apiBaseUrl = getApiBaseUrl();
      const response = await fetch(`${apiBaseUrl}/genres/${genreId}/diagnose`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildDiagnoseRequestBody(answers)),
      });
      if (!response.ok) {
        throw new Error(`Failed to diagnose: ${response.status}`);
      }
      const result = parseDiagnoseResponse(await response.json());
      setSubmitState({ status: "done", result });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      setSubmitState({ status: "error", message });
    }
  }

  if (submitState.status === "done") {
    const { type, score } = submitState.result;
    return (
      <section aria-label="診断結果">
        <h2>{type.name}</h2>
        <p>{type.description}</p>
        <p>score: {score}</p>
      </section>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {questions.map((question) => (
        <fieldset key={question.id}>
          <legend>{question.text}</legend>
          {question.answers.map((answer) => (
            <label key={answer.id}>
              <input
                type="radio"
                name={question.id}
                value={answer.id}
                checked={answers.get(question.id) === answer.id}
                onChange={() => {
                  setAnswers((prev) => {
                    const next = new Map(prev);
                    next.set(question.id, answer.id);
                    return next;
                  });
                }}
              />
              {answer.text}
            </label>
          ))}
        </fieldset>
      ))}
      <button type="submit" disabled={!allAnswered || submitState.status === "submitting"}>
        診断する
      </button>
      {submitState.status === "error" && (
        <p role="alert">診断に失敗しました: {submitState.message}</p>
      )}
    </form>
  );
}
