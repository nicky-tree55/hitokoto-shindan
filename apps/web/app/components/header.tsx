/**
 * Header: 全ステップ共通のヘッダー。
 * ロゴ「一問一言」と「使い方」「ジャンル」の表示のみを行う（実際の遷移先ページは作らない、装飾表示）。
 */
export function Header() {
  return (
    <header className="flex shrink-0 items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
      <span className="text-base font-bold tracking-wide sm:text-lg">一問一言</span>
      <div className="flex items-center gap-4 text-xs text-muted sm:text-sm">
        <span>使い方</span>
        <span>ジャンル</span>
      </div>
    </header>
  );
}
