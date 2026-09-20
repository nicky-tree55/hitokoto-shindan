{
  description = "hitokoto-shindan dev environment (Bun + Wrangler pinned via Nix)";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
      in
      {
        devShells.default = pkgs.mkShell {
          # Bun is the JS runtime/package manager for this repo; Wrangler is the
          # Cloudflare CLI used to build/deploy Pages and Workers. Both are pinned
          # here so local dev and CI always resolve the same tool versions.
          packages = [
            pkgs.bun
            pkgs.wrangler
          ];

          shellHook = ''
            echo "hitokoto-shindan dev shell: bun $(bun --version), wrangler $(wrangler --version 2>/dev/null | head -n1)"
          '';
        };
      });
}
