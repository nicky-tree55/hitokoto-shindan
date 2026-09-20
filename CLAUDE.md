# CLAUDE.md — Repository Working Agreement

このファイルは、このリポジトリで作業するAIエージェント（GitHub Copilot CLI等）および
人間コントリビューター共通の運用ルールを定義する。すべての変更はこのルールに従うこと。

## 1. パッケージ追加・プロジェクト作成はCLI経由のみ

- `package.json` の依存関係、lockfile、`wrangler.jsonc` 等の設定ファイルを
  **手動編集でパッケージ追加/バージョン変更してはならない**。
- 必ずパッケージマネージャ／スキャフォールドツールのコマンドを使うこと。
  - 依存追加: `bun add <pkg>` / `bun add -d <pkg>`
  - プロジェクト作成: `bun create next-app@latest apps/web` 等の公式スキャフォールドコマンド
  - Cloudflare Worker初期化: `bunx wrangler init` / `bunx create-cloudflare@latest`
- 理由: 最新かつ整合性のあるバージョンが解決され、タイポや不整合なlockfileを防げるため。
- スクリプト追加やcompilerOptionsの調整など、依存関係に関係ない設定変更は手動編集してよい。

## 2. ブランチ運用

- `main` は保護ブランチ。直接コミット・直接push・force pushは禁止
  （例外: ユーザーの明示的指示によるロールバックのみ、実施理由をコミットメッセージ/Issueコメントに残す）。
- 作業は必ずブランチを切って行う。1ブランチ = 1 Issue（1つの論理的な作業単位）を基本とする。
- ブランチ命名規則: `<type>/<短いkebab-caseの説明>`
  - `type` は Conventional Commits に準拠: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `ci`
  - 説明はIssueタイトルと対応させる
  - 例: `feat/nix-flake-bun-wrangler`, `docs/claude-md`, `ci/pr-checks`
- `main` の最新から分岐し、追随が必要な場合はmerge commitではなくrebaseを使う。

## 3. PRの作成・受け入れルール

- すべての変更はPR経由でmainに取り込む。PRは対応するIssueを `Closes #N` で参照する。
- PR本文には最低限「概要 / 変更内容 / 検証方法・結果」を記載する。
- **マージ方式は Squash merge のみ**（`gh pr merge --squash`）。mainの履歴を1PR=1コミットで線形に保つ。
- コミット/PRタイトルは Conventional Commits 形式（`feat: ...`, `fix: ...` 等）に従う。
- CI（lint/typecheck/test/build）が構成された後は、CIが green になってからマージする。
  CI未整備の段階では、ローカルで実行したコマンドと結果をPR本文に明記する。
- マージ後はブランチを削除する。

## 4. DDD境界の遵守

- `packages/domain`: フレームワーク非依存。HTTP/Cloudflare/Jev/Next.js等への依存を一切持たない。
- `packages/application`: ユースケースおよびRepository/DecisionClassifierのinterfaceを置く。
  依存してよいのは `domain` のみ。
- Infrastructure（将来追加）: `application` が定義したinterfaceの実装を置く。
  `domain`/`application` から infrastructure への直接依存は禁止（依存性逆転を維持する）。
- Presentation（`apps/web`, `apps/api`）: infrastructureとapplicationを組み合わせて配線する層。
  フレームワーク・ランタイム固有の実装はここに閉じ込める。
- 依存方向は一方向のみ: presentation → application → domain。
  domain/applicationからapps/*やフレームワークパッケージへの逆流を禁止する。

## 5. スキーマ検証ライブラリ

- 実行時スキーマ検証・型推論には **valibot** を使用する（zodは採用しない）。
  理由: zero-dependency・tree-shakableなpipe/関数合成ベースのAPIで、
  Cloudflare Workers（`apps/api`）のようなエッジランタイムでのバンドルサイズに有利なため。
- 共有スキーマは `packages/contracts` に置き、`apps/api`/`apps/web` の双方から参照する。
  `packages/contracts` は DDD境界上 `domain` に依存してよいが、フレームワーク/ランタイム固有の
  実装を持ち込まない。
- valibotの追加はルール1に従い `bun add valibot` 経由で行う（手動での`package.json`編集禁止）。

## 6. Secret管理

- Cloudflare API Token、将来のJev/TypeSafe APIキー等の秘密情報は
  **GitHub Actions Secrets（リポジトリ or 環境単位）にのみ集約する**。
- 実値を含む `.env*` ファイルはコミットしない。変数名と説明のみを記載した
  `.env.example` はコミットしてよい。
- 秘密情報をNext.jsのブラウザ側バンドルに渡してはならない。秘密情報を要する処理は
  すべてCloudflare Worker側（サーバーサイド）で完結させる。
- ローカル開発用の `.env` / `.dev.vars` は各開発者が手動で用意し、gitignore対象とする。
  AIエージェントが実際の秘密値を生成・記載することはない。

## 7. その他

- PRは1 Issueに対応するスコープに留め、無関係な大規模リファクタを混在させない。
- 迷った場合はこのファイルのルールを優先し、逸脱する場合はPR本文で理由を明記する。
