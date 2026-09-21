"use client";

import type { Question } from "@hitokoto-shindan/contracts";
import { useActionState, useEffect, useState } from "react";
import { diagnoseAction, initialDiagnoseActionState } from "./lib/actions";
import { fetchGenreAndQuestion } from "./lib/api";

type LoadState =
  | { status: "loading" }
  | { status: "ready"; genreId: string; question: Question }
  | { status: "error"; message: string };

/**
 * DiagnosisForm: apps/api から単一の質問（フリーテキスト回答を前提とする1問）を取得し、
 * 回答フォームを表示、送信後にモックの診断結果を表示するClient Component。
 * 送信状態・結果の管理は useActionState に任せ、手動の useState による送信状態管理を行わない。
 */
export default function DiagnosisForm() {
  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;

    fetchGenreAndQuestion()
      .then(({ genreId, question }) => {
        if (!cancelled) {
          setLoadState({ status: "ready", genreId, question });
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          const message = error instanceof Error ? error.message : "Unknown error";
          setLoadState({ status: "error", message });
        }
      });

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

  return <ReadyDiagnosisForm genreId={loadState.genreId} question={loadState.question} />;
}

function ReadyDiagnosisForm({ genreId, question }: { genreId: string; question: Question }) {
  const [state, formAction, pending] = useActionState(
    diagnoseAction.bind(null, genreId, question.id),
    initialDiagnoseActionState,
  );

  if (state.status === "done") {
    const { type, score } = state.result;
    return (
      <section aria-label="診断結果">
        <h2>{type.name}</h2>
        <p>{type.description}</p>
        <p>score: {score}</p>
      </section>
    );
  }

  return (
    <form action={formAction}>
      <label htmlFor="answerText">{question.text}</label>
      <textarea id="answerText" name="answerText" rows={6} required />
      <button type="submit" disabled={pending}>
        診断する
      </button>
      {state.status === "error" && <p role="alert">{state.message}</p>}
    </form>
  );
}
