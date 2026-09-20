# apps/web

`hitokoto-shindan` のフロントエンド（Next.js App Router）。
`next.config.ts` で `output: 'export'` を設定し、静的サイトとしてビルドしてCloudflare Pagesにデプロイします。

## 開発

リポジトリルートで `nix develop` に入ってから実行してください。

```sh
bun install                 # ルートで一度実行すればOK
bun run --filter web dev    # http://localhost:3000 でHello Worldページを確認
```

## ビルド（静的export）

```sh
bun run --filter web build  # apps/web/out/ に静的ファイルが生成される
```

## テスト

```sh
bun test apps/web
```
