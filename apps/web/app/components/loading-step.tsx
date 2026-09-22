/**
 * LoadingStep: 回答送信中に表示する「診断中」画面。
 * ユーザーに「AIツールを操作している」感覚を与えないよう、進捗バーや詳細な
 * ステータス文言は表示せず、控えめな待機表示のみとする（過剰なアニメーションは禁止。
 * Tailwind標準の animate-pulse のみを使用し、3つのドットをずらして点滅させる）。
 */
export function LoadingStep() {
  return (
    <section
      aria-label="診断中"
      aria-live="polite"
      className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-4 px-4 py-10 transition-opacity duration-300 sm:py-16"
    >
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-primary [animation-delay:0ms]" />
        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-primary [animation-delay:200ms]" />
        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-primary [animation-delay:400ms]" />
      </div>
      <p className="text-muted">診断中…</p>
    </section>
  );
}
