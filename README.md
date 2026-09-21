# hitokoto-shindan

## 開発環境

このリポジトリでは [Nix flakes](https://nixos.wiki/wiki/Flakes) を使って開発ツール（Bun / Wrangler CLI）のバージョンをpinしています。
Node.js単体は導入せず、Bunが提供するJSランタイムを使用します。

```sh
# nix developで開発シェルに入る（Bun/Wranglerが使えるようになる）
nix develop

# direnvを使っている場合は、初回のみ許可
direnv allow

# 1コマンドで開発シェルに入り依存関係をインストールする場合
nix develop -c bun install

# 1コマンドで開発シェルに入り開発サーバを起動する場合（Next.js: apps/web）
nix develop -c bun run --filter web dev

# 1コマンドで開発シェルに入り開発サーバを起動する場合（Cloudflare Workers: apps/api）
nix develop -c bun run --filter api dev
```

## リポジトリ構成

Bun workspacesによるmonorepo構成です。

- `apps/*`: プレゼンテーション層（Next.js、Cloudflare Workers等）
- `packages/*`: `domain`（フレームワーク非依存のドメインロジック）、`application`（ユースケース/interface）、
  `contracts`（apps間で共有するvalibotスキーマ）、`infrastructure`（Repository/DecisionClassifierのモック実装。
  Jevによる実際の分類ロジックはまだ実装しておらず、固定の診断結果を返すモックで代替している）

## ローカルで質問→診断結果（モック）を確認する

apps/api（Cloudflare Worker）と apps/web（Next.js）を同時に起動すると、
ローカルで「質問に回答→診断結果が返る」までの一連の流れを確認できます。
現時点では診断ロジック（Jev）はモック実装のため、常に固定の診断結果が返ります。

```sh
# 依存関係のインストール（初回のみ）
nix develop -c bun install

# apps/web用の環境変数ファイルを用意（apps/api のURLを指す、初回のみ）
cp apps/web/.env.example apps/web/.env.local

# ワンラインでapps/api（http://localhost:8787）とapps/web（http://localhost:3000）を同時起動
nix develop -c bun run dev
```

（各アプリを個別に起動したい場合は `nix develop -c bun run --filter api dev` /
`nix develop -c bun run --filter web dev` をそれぞれ別ターミナルで実行してください。）

`http://localhost:3000` をブラウザで開き、質問に回答して「診断する」ボタンを押すと、
apps/api の `POST /genres/:id/diagnose` 経由で診断結果（Type名・説明・score）が表示されます。

apps/api が公開する主なエンドポイント:

| メソッド | パス | 内容 |
|---|---|---|
| GET | `/health` | 疎通確認用 |
| GET | `/genres` | ジャンル一覧（モックデータ、単一ジャンルのみ） |
| GET | `/genres/:id/questions` | 指定ジャンルの質問一覧 |
| POST | `/genres/:id/diagnose` | 回答一覧から診断結果を返す（モックDecisionClassifierのため常に固定結果） |

## セットアップ

```sh
bun install
```

## Lint / Format

Lint・FormatにはESLint/Prettierの代わりに [Biome](https://biomejs.dev/) を使用します。

```sh
bun run lint    # lintのみ
bun run format  # formatを自動修正
bun run check   # lint + format + import整理のチェック
```

## 動作確認コマンド

```sh
nix develop -c bun run check       # Biome (lint + format + import整理)
nix develop -c bun run typecheck   # domain/application/contracts/infrastructure/apps/api の型検査
nix develop -c bun test            # 全ワークスペースのユニットテスト
nix develop -c bun run --filter web build   # apps/web の静的書き出しビルド
```


