import { GenreSelect } from "./genre-select";

/**
 * TopStep: フローの起点となるトップ画面。
 * 見出し + 自由入力（送信すると既存の単一質問に対する回答として直接診断へ進む）と、
 * ジャンル選択チップ（選択すると質問ステップへ進む。#22のスコープにより、どのチップも
 * 現状は同一の単一ジャンル・単一質問に遷移する）を表示する。
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
      className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-8 px-4 py-10 transition-opacity duration-300 sm:gap-10 sm:px-6 sm:py-16"
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
        <div className="flex items-center gap-2 rounded-full border border-border bg-surface py-1 pr-1.5 pl-5 shadow-sm">
          <input
            type="text"
            name="answerText"
            required
            placeholder="今、考えていることや悩みを自由に書いてください…"
            className="min-h-12 min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted"
          />
          <button
            type="submit"
            aria-label="診断する"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-foreground text-primary-foreground transition-transform duration-150 active:scale-95"
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

      <GenreSelect onSelect={onSelectGenre} />
    </section>
  );
}
