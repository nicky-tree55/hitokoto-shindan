"use client";

import type { DiagnoseResponse } from "@hitokoto-shindan/contracts";
import { useState } from "react";

type ShareState = "idle" | "copied" | "error";

type ShareOutcome = "shared" | "cancelled" | "copied" | "error" | "unsupported";

type ShareDeps = {
  share?: (data: { text: string; url?: string }) => Promise<void>;
  writeText?: (text: string) => Promise<void>;
  url?: string;
};

/** 診断結果からシェア用のテキストを組み立てる（テスト容易性のため純粋関数として分離）。 */
export function buildShareText(result: DiagnoseResponse): string {
  return `わたしは「${result.type.name}」タイプでした。#一問一言`;
}

/**
 * 結果をシェアする（Web Share APIを優先し、非対応時はクリップボードコピーにフォールバック）。
 * `deps` にブラウザAPIを注入できるようにし、DOM無しの環境でも挙動をテスト可能にする。
 */
export async function shareResult(
  result: DiagnoseResponse,
  deps: ShareDeps,
): Promise<ShareOutcome> {
  const text = buildShareText(result);

  if (deps.share) {
    try {
      await deps.share({ text, url: deps.url });
      return "shared";
    } catch {
      // ユーザーによるキャンセル等はエラー表示せず無視する
      return "cancelled";
    }
  }

  if (deps.writeText) {
    try {
      await deps.writeText(deps.url ? `${text} ${deps.url}` : text);
      return "copied";
    } catch {
      return "error";
    }
  }

  return "unsupported";
}

/**
 * ResultStep: 診断結果画面。
 * 「もう一度」でフロー全体を初期状態に戻す。
 * 「シェアする」は Web Share API (navigator.share) を優先し、非対応ブラウザでは
 * クリップボードコピー (navigator.clipboard.writeText) にフォールバックする。
 */
export function ResultStep({
  result,
  onRestart,
}: {
  result: DiagnoseResponse;
  onRestart: () => void;
}) {
  const [shareState, setShareState] = useState<ShareState>("idle");

  async function handleShare() {
    const outcome = await shareResult(result, {
      share:
        typeof navigator !== "undefined" && navigator.share
          ? (data) => navigator.share(data)
          : undefined,
      writeText:
        typeof navigator !== "undefined" && navigator.clipboard
          ? (text) => navigator.clipboard.writeText(text)
          : undefined,
      url: typeof window !== "undefined" ? window.location.href : undefined,
    });

    if (outcome === "copied") {
      setShareState("copied");
      setTimeout(() => setShareState("idle"), 2000);
    } else if (outcome === "error") {
      setShareState("error");
      setTimeout(() => setShareState("idle"), 2000);
    }
  }

  const shareLabel =
    shareState === "copied"
      ? "コピーしました"
      : shareState === "error"
        ? "コピーに失敗しました"
        : "シェアする";

  return (
    <section
      aria-label="診断結果"
      className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-6 px-4 py-10 text-center transition-opacity duration-300 sm:py-16"
    >
      <span
        aria-hidden
        className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-2xl font-semibold text-foreground"
      >
        {result.type.name.slice(0, 1)}
      </span>
      <p className="text-muted">あなたは…</p>
      <h2>{result.type.name}</h2>
      <p className="max-w-xl text-balance">{result.type.description}</p>

      <div className="flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row">
        <button
          type="button"
          onClick={onRestart}
          className="w-full min-h-12 rounded-full bg-foreground px-8 py-3 text-primary-foreground transition-transform duration-150 active:scale-95 sm:w-auto"
        >
          もう一度
        </button>
        <button
          type="button"
          onClick={handleShare}
          className="w-full min-h-12 rounded-full border border-border px-8 py-3 text-foreground transition-transform duration-150 active:scale-95 sm:w-auto"
        >
          {shareLabel}
        </button>
      </div>
    </section>
  );
}
