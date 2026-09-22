import type { Question } from "@hitokoto-shindan/contracts";

/**
 * QuestionStep: ジャンル選択後に表示する、質問文 + 自由回答フォーム。
 * 優先順位（質問 > 自由入力 > 回答ボタン）に沿って、質問文を大きめに、
 * 回答ボタンをタップしやすいサイズで配置する。
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
      className="relative mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-8 px-4 py-10 transition-opacity duration-300 sm:px-6 sm:py-16"
    >
      <button
        type="button"
        onClick={onBack}
        aria-label="トップに戻る"
        className="absolute top-4 left-4 flex h-11 w-11 items-center justify-center rounded-full text-muted transition-colors duration-150 hover:bg-surface hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:top-6 sm:left-6"
      >
        ←
      </button>

      <label
        htmlFor="answerText"
        className="max-w-xl text-center text-xl font-semibold text-balance sm:text-2xl"
      >
        {question.text}
      </label>

      <form action={formAction} className="flex w-full max-w-xl flex-col items-stretch gap-3">
        <textarea
          id="answerText"
          name="answerText"
          rows={4}
          required
          placeholder="自由に入力してください…"
          className="min-h-32 w-full rounded-2xl border border-border bg-surface p-4 text-foreground outline-none placeholder:text-muted focus-visible:ring-2 focus-visible:ring-primary sm:p-5"
        />
        <button
          type="submit"
          className="self-center rounded-full bg-foreground px-10 py-3.5 text-primary-foreground transition-transform duration-150 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:px-12 sm:py-4"
        >
          診断する
        </button>
        {errorMessage && (
          <p role="alert" className="text-center text-error">
            {errorMessage}
          </p>
        )}
      </form>
    </section>
  );
}
