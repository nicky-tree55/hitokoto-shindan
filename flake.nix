{
  description = "hitokoto-shindan development environment (Bun + Wrangler)";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
      in
      {
        devShells.default = pkgs.mkShell {
          packages = [
            pkgs.bun
            pkgs.wrangler
          ];

          shellHook = ''
            echo "bun:      $(bun --version)"
            echo "wrangler: $(wrangler --version)"
          '';
        };
      });
}
