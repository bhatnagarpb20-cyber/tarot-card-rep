/** Exports card art as standalone SVG strings (JSON) for marketing renders: `tsx scripts/art/export-svgs.tsx <out.json> <id…>`. */
import * as React from "react";
import { writeFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";

async function main() {
  (globalThis as { React?: typeof React }).React = React;
  const { VECTOR_ART } = await import("../../src/components/cards/art");
  const { CardBack } = await import("../../src/components/cards/CardBack");
  const [out, ...ids] = process.argv.slice(2);
  const result: Record<string, string> = { back: renderToStaticMarkup(React.createElement(CardBack)) };
  for (const id of ids) result[id] = renderToStaticMarkup(React.createElement(VECTOR_ART[id].Component));
  writeFileSync(out, JSON.stringify(result));
  console.log(Object.keys(result).join(", "));
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
