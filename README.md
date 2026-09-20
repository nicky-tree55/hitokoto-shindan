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
- `packages/*`: `domain`（フレームワーク非依存のドメインロジック）、`application`（ユースケース/interface）等

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

