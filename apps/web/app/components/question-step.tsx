import type { Question } from "@hitokoto-shindan/contracts";

/**
 * QuestionStep: ジャンル選択後に表示する、質問文 + 自由回答フォーム。
 * デザインの詳細（レイアウト・レスポンシブ対応）は #48 で仕上げる。
 */
export function QuestionStep({
  question,
  formAction,
  errorMessage,
  onBack,
}: {
  question: Question;
  formAction: (formData: FormData) => void;
  errorMessage?: string;
  onBack: () => void;
}) {
  return (
    <section
      aria-label="質問"
      className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-8 px-4 py-10 transition-opacity duration-300 sm:px-6 sm:py-16"
    >
      <label htmlFor="answerText" className="max-w-xl text-center text-balance">
        {question.text}
      </label>

      <form action={formAction} className="flex w-full max-w-xl flex-col items-stretch gap-3">
        <textarea
          id="answerText"
          name="answerText"
          rows={4}
          required
          placeholder="自由に入力してください…"
          className="min-h-32 w-full rounded-2xl border border-border bg-surface p-4 text-foreground outline-none placeholder:text-muted"
        />
        <button
          type="submit"
          className="self-center rounded-full bg-foreground px-8 py-3 text-primary-foreground transition-transform duration-150 active:scale-95"
        >
          診断する
        </button>
        {errorMessage && (
          <p role="alert" className="text-center text-error">
            {errorMessage}
          </p>
        )}
      </form>

      <button
        type="button"
        onClick={onBack}
        aria-label="トップに戻る"
        className="text-muted underline decoration-border underline-offset-4 transition-colors duration-150 hover:text-foreground"
      >
        ← 戻る
      </button>
    </section>
  );
}
