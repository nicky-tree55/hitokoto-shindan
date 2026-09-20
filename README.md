# hitokoto-shindan

## 開発環境

このリポジトリでは [Nix flakes](https://nixos.wiki/wiki/Flakes) を使って開発ツール（Bun / Wrangler CLI）のバージョンをpinしています。
Node.js単体は導入せず、Bunが提供するJSランタイムを使用します。

```sh
# nix developで開発シェルに入る（Bun/Wranglerが使えるようになる）
nix develop

# direnvを使っている場合は、初回のみ許可
direnv allow
```
