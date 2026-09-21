/**
 * LoadingStep: 回答送信中に表示する「診断中」画面。
 * ユーザーに「AIツールを操作している」感覚を与えないよう、進捗バーや詳細な
 * ステータス文言は表示せず、控えめな待機表示のみとする（過剰なアニメーションは禁止）。
 * 演出の詳細（デザイン仕上げ）は #50 で行う。
 */
export function LoadingStep() {
  return (
    <section
      aria-label="診断中"
      aria-live="polite"
      className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-4 px-4 py-10 transition-opacity duration-300 sm:py-16"
    >
      <div className="h-3 w-3 animate-pulse rounded-full bg-primary" />
      <p className="text-muted">診断中…</p>
    </section>
  );
}
