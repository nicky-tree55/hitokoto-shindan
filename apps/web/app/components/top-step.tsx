/**
 * TopStep: フローの起点となるトップ画面。
 * 見出し + 自由入力（送信すると既存の単一質問に対する回答として直接診断へ進む）と、
 * ジャンル選択への導線を表示する。
 * ジャンルチップの実際のデザイン（アイコン付き・複数ジャンル表示）は #46 で実装する。
 * 現時点では最小限のボタンで「質問ステップへ進む」導線のみを提供する。
 */
export function TopStep({
  formAction,
  errorMessage,
  onSelectGenre,
}: {
  formAction: (formData: FormData) => void;
  errorMessage?: string;
  onSelectGenre: () => void;
}) {
  return (
    <section
      aria-label="トップ"
      className="flex min-h-dvh flex-col items-center justify-center gap-8 px-4 py-16 transition-opacity duration-300"
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <h1 className="text-balance">
          考えていることを、
          <br />
          ひとつの言葉に。
        </h1>
        <p className="text-muted">あなたの思考や悩みを、ひとつの言葉で表現します。</p>
      </div>

      <form action={formAction} className="flex w-full max-w-xl flex-col items-stretch gap-3">
        <div className="flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-3 shadow-sm">
          <input
            type="text"
            name="answerText"
            required
            placeholder="今、考えていることや悩みを自由に書いてください…"
            className="min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted"
          />
          <button
            type="submit"
            aria-label="診断する"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-foreground text-primary-foreground transition-transform duration-150 active:scale-95"
          >
            →
          </button>
        </div>
        {errorMessage && (
          <p role="alert" className="text-center text-error">
            {errorMessage}
          </p>
        )}
      </form>

      <button
        type="button"
        onClick={onSelectGenre}
        className="text-muted underline decoration-border underline-offset-4 transition-colors duration-150 hover:text-foreground"
      >
        ジャンルから選ぶ
      </button>
    </section>
  );
}
