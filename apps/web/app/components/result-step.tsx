import type { DiagnoseResponse } from "@hitokoto-shindan/contracts";

/**
 * ResultStep: 診断結果画面。
 * 「もう一度」でフロー全体を初期状態に戻す。「シェアする」ボタンは #47 で追加する。
 * デザインの詳細（アイコン装飾・レイアウト仕上げ）は #47 で行う。
 */
export function ResultStep({
  result,
  onRestart,
}: {
  result: DiagnoseResponse;
  onRestart: () => void;
}) {
  return (
    <section
      aria-label="診断結果"
      className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-6 px-4 py-10 text-center transition-opacity duration-300 sm:py-16"
    >
      <p className="text-muted">あなたは…</p>
      <h2>{result.type.name}</h2>
      <p className="max-w-xl text-balance">{result.type.description}</p>

      <button
        type="button"
        onClick={onRestart}
        className="rounded-full bg-foreground px-8 py-3 text-primary-foreground transition-transform duration-150 active:scale-95"
      >
        もう一度
      </button>
    </section>
  );
}
