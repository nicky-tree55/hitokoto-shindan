"use client";

import type { Question } from "@hitokoto-shindan/contracts";
import { useActionState, useEffect, useState } from "react";
import { LoadingStep } from "./components/loading-step";
import { QuestionStep } from "./components/question-step";
import { ResultStep } from "./components/result-step";
import { TopStep } from "./components/top-step";
import { diagnoseAction, initialDiagnoseActionState } from "./lib/actions";
import { fetchGenreAndQuestion } from "./lib/api";

type LoadState =
  | { status: "loading" }
  | { status: "ready"; genreId: string; question: Question }
  | { status: "error"; message: string };

/**
 * DiagnosisFlow: 「トップ→ジャンル選択→質問→自由入力→診断中→結果→もう一度」の
 * 一連の体験を、ページ遷移させずに単一コンポーネント内の状態遷移として表現するフロー制御。
 * apps/api から単一の質問（フリーテキスト回答を前提とする1問）を取得できるまでは
 * loading/error表示を行い、取得後はQuestionFlowに実際の画面遷移を委譲する。
 */
export default function DiagnosisFlow() {
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
    return (
      <p className="flex flex-1 items-center justify-center p-6 text-center text-muted">
        質問を読み込み中です...
      </p>
    );
  }

  if (loadState.status === "error") {
    return (
      <p
        role="alert"
        className="flex flex-1 items-center justify-center p-6 text-center text-error"
      >
        質問の読み込みに失敗しました: {loadState.message}
      </p>
    );
  }

  return <QuestionFlow genreId={loadState.genreId} question={loadState.question} />;
}

/**
 * QuestionFlow: `resetKey`をReactの`key`として使い、「もう一度」操作時に
 * QuestionFlowSessionごと再マウントすることで、ステップ・送信状態(useActionState)の
 * 両方を初期状態に戻す。
 */
function QuestionFlow({ genreId, question }: { genreId: string; question: Question }) {
  const [resetKey, setResetKey] = useState(0);

  return (
    <QuestionFlowSession
      key={resetKey}
      genreId={genreId}
      question={question}
      onRestart={() => setResetKey((count) => count + 1)}
    />
  );
}

type FlowStep = "top" | "question";

function QuestionFlowSession({
  genreId,
  question,
  onRestart,
}: {
  genreId: string;
  question: Question;
  onRestart: () => void;
}) {
  const [step, setStep] = useState<FlowStep>("top");
  const [state, formAction, pending] = useActionState(
    diagnoseAction.bind(null, genreId, question.id),
    initialDiagnoseActionState,
  );

  if (state.status === "done") {
    return <ResultStep result={state.result} onRestart={onRestart} />;
  }

  if (pending) {
    return <LoadingStep />;
  }

  const errorMessage = state.status === "error" ? state.message : undefined;

  if (step === "question") {
    return (
      <QuestionStep
        question={question}
        formAction={formAction}
        errorMessage={errorMessage}
        onBack={() => setStep("top")}
      />
    );
  }

  return (
    <TopStep
      formAction={formAction}
      errorMessage={errorMessage}
      onSelectGenre={() => setStep("question")}
    />
  );
}
