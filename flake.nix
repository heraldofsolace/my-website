{
  description = "Dev environment for aniket's portfolio site (Next.js + Tailwind + Framer Motion)";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-26.05";
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
            pkgs.nodejs_22
            pkgs.chromium # headless screenshots / local QA
            pkgs.claude-code
          ];

          shellHook = ''
            export PUPPETEER_EXECUTABLE_PATH="${pkgs.chromium}/bin/chromium"
          '';
        };
      });
}
