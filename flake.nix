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

        # Shared libs `npx playwright install`'s own downloaded Chromium
        # needs at runtime. This host has none of them outside the Nix
        # store (no system X11/NSS), so the unpatched download fails with
        # "error while loading shared libraries". nixpkgs' own
        # `playwright-driver.browsers` would sidestep this (browsers
        # pre-wired with correct RPATHs), but nixos-26.05 pins an older
        # Playwright revision than this repo's `@playwright/test`
        # (mismatched browser-folder names), so we keep Playwright's own
        # download and just fill in the missing libraries via
        # LD_LIBRARY_PATH instead.
        playwrightRuntimeLibs = with pkgs; lib.makeLibraryPath [
          nss nspr atk at-spi2-atk at-spi2-core cups dbus libdrm gtk3 pango
          cairo gdk-pixbuf glib libx11 libxcb libxcomposite libxdamage
          libxext libxfixes libxrandr libxshmfence libxkbcommon mesa expat
          alsa-lib libglvnd systemd
        ];
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
            export LD_LIBRARY_PATH="${playwrightRuntimeLibs}''${LD_LIBRARY_PATH:+:}$LD_LIBRARY_PATH"
          '';
        };
      });
}
