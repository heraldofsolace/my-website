"use client";

import { Highlight, Prism, type PrismTheme } from "prism-react-renderer";

// prism-react-renderer only bundles a base subset of Prism's languages —
// bash and ini show up in real posts (shell commands, config snippets) but
// aren't in that subset, so pull their grammars in from prismjs directly
// (the documented extension mechanism: prismjs's per-language files mutate
// a global `Prism.languages`, so it has to be the *same* Prism instance
// prism-react-renderer renders with). Any language not covered here (or by
// the base subset) just renders unhighlighted rather than breaking — see
// prism-react-renderer's fallback for an unmatched grammar.
//
// `require`, not `import`: ESM imports are hoisted above the `global.Prism =`
// assignment below regardless of source order, so prismjs's component files
// would run before the global they mutate exists. `require` runs in place.
(typeof global !== "undefined" ? global : window).Prism = Prism;
// eslint-disable-next-line @typescript-eslint/no-require-imports
require("prismjs/components/prism-bash");
// eslint-disable-next-line @typescript-eslint/no-require-imports
require("prismjs/components/prism-ini");

// A restrained two-tone highlight — muted for secondary/literal tokens,
// accent for the "important" (control-flow, declaration) ones — rather than
// the usual multicolor scheme. Matches how the rest of the site spends
// --accent sparingly against --fg/--muted (and echoes the italic modifier
// in BlocksContent, which is --muted too instead of an actual italic).
const codeTheme: PrismTheme = {
  plain: { color: "var(--fg)", backgroundColor: "transparent" },
  styles: [
    {
      types: [
        "comment",
        "prolog",
        "doctype",
        "cdata",
        "punctuation",
        "operator",
        "entity",
        "string",
        "char",
        "attr-value",
        "inserted",
        "url",
      ],
      style: { color: "var(--muted)" },
    },
    {
      types: [
        "keyword",
        "atrule",
        "tag",
        "property",
        "function",
        "class-name",
        "constant",
        "symbol",
        "deleted",
        "boolean",
        "number",
        "regex",
        "important",
        "variable",
        "builtin",
        "selector",
        "attr-name",
      ],
      style: { color: "var(--accent)" },
    },
  ],
};

export default function CodeBlock({
  code,
  language,
}: {
  code: string;
  language?: string;
}) {
  return (
    <Highlight code={code.trim()} language={(language ?? "text").toLowerCase()} theme={codeTheme}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={`${className} overflow-x-auto rounded-xl border border-line bg-bg-soft p-5 font-mono text-sm`}
          style={style}
        >
          <code>
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </code>
        </pre>
      )}
    </Highlight>
  );
}
