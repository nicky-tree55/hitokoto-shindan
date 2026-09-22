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
ローカルで「質問（1問・フリーテキスト回答）に回答→診断結果が返る」までの一連の流れを確認できます。
質問は1問のみのフリーテキスト形式とし、将来Jevへ自然文を渡して解釈させることを見据えた構成にしています。
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

`http://localhost:3000` をブラウザで開き、フリーテキストで回答して「診断する」ボタンを押すと、
apps/api の `POST /genres/:id/diagnose` 経由で診断結果（Type名・説明・score）が表示されます。
apps/web は静的export（Cloudflare Pages配信）のためサーバーサイド実行を持たず、
質問の取得・診断結果の送信はいずれもブラウザから直接apps/apiを呼び出します。
送信状態・結果の管理には React の `useActionState` を使い、手動の `useState` によるフォーム送信状態管理を排除しています。

apps/api が公開する主なエンドポイント:

| メソッド | パス | 内容 |
|---|---|---|
| GET | `/health` | 疎通確認用 |
| GET | `/genres` | ジャンル一覧（モックデータ、単一ジャンルのみ） |
| GET | `/genres/:id/question` | 指定ジャンルの質問（1問・フリーテキスト回答を前提とする） |
| POST | `/genres/:id/diagnose` | `{ questionId, answerText }` から診断結果を返す（モックDecisionClassifierのため常に固定結果） |

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

## デプロイ（GitHub Actions）

`main` へのpush時に、以下のワークフローが自動でCloudflareへデプロイします。

- `.github/workflows/deploy-pages.yml`: `apps/web` を静的exportビルドし、`wrangler pages deploy` でCloudflare Pages（プロジェクト名: `hitokoto-shindan-web`）へデプロイ
- `.github/workflows/deploy-worker.yml`: `apps/api` を `wrangler deploy` でCloudflare Workersへデプロイ

これらのワークフローを実行するには、リポジトリの Settings > Secrets and variables > Actions に以下のSecretsを設定してください。

| Secret名 | 内容 |
|---|---|
| `CLOUDFLARE_API_TOKEN` | Cloudflareダッシュボードで発行するAPIトークン（Workers編集・Pages編集権限が必要） |
| `CLOUDFLARE_ACCOUNT_ID` | デプロイ先のCloudflareアカウントID |


