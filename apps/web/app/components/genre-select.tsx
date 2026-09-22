/**
 * GenreSelect: ラフ画の「選べるジャンル」チップ群。
 * 現時点ではapps/apiが単一ジャンルのみを提供するため、どのチップを選択しても
 * 同じ質問（既存の単一ジャンル・単一質問モック）に遷移する（`onSelect`はジャンルを
 * 問わず呼び出される）。ジャンルごとの分岐は将来のバックエンド対応後に扱う。
 * アイコンは彩度を抑えたパステル背景 + ラベル頭文字のバッジで統一感を保つ。
 */
const GENRES = [
  { id: "animal", label: "動物" },
  { id: "love", label: "恋愛" },
  { id: "personality", label: "性格" },
  { id: "work", label: "仕事" },
  { id: "rpg", label: "RPG" },
  { id: "weather", label: "天気" },
  { id: "color", label: "色" },
  { id: "other", label: "その他" },
] as const;

const BADGE_TONES = ["bg-primary/10", "bg-accent/10", "bg-highlight/10"] as const;

export function GenreSelect({ onSelect }: { onSelect: () => void }) {
  return (
    <div className="flex w-full max-w-2xl flex-col items-center gap-3">
      <p className="text-sm text-muted">選べるジャンル</p>
      <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3 sm:gap-x-6">
        {GENRES.map((genre, index) => (
          <li key={genre.id}>
            <button
              type="button"
              onClick={onSelect}
              className="flex flex-col items-center gap-1.5 rounded-2xl px-1 py-1 transition-transform duration-150 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <span
                aria-hidden
                className={`flex h-12 w-12 items-center justify-center rounded-full text-base font-semibold text-foreground sm:h-14 sm:w-14 ${
                  BADGE_TONES[index % BADGE_TONES.length]
                }`}
              >
                {genre.label.slice(0, 1)}
              </span>
              <span className="text-xs text-muted">{genre.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
