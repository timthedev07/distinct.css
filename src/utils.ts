import { lstatSync, readFileSync } from "fs";
import { ansi, BOLD, YELLOW, RESET, CYAN } from "./constants";
import { PositionInfo, Property, RuleSet } from "./types";

/**
 *
 * @param path Absolute path
 * @returns
 */
export const isDirectory = (path: string) => lstatSync(path).isDirectory();

export const showInFile = (
  position: PositionInfo,
  pointerPosition?: number
) => {
  if (!position || !position.source) {
    return console.error("Error in unknown file.");
  }

  const lines = readFileSync(position.source).toString().split("\n");

  const line = lines[position.start!.line! - 1];

  const beforeBeforeInd: number = position.start!.line! - 3;
  const beforeBefore =
    beforeBeforeInd > -1
      ? ` ${beforeBeforeInd + 1} | ` + lines[beforeBeforeInd]
      : "";

  const beforeInd: number = position.start!.line! - 2;
  const before =
    beforeInd > -1 ? ` ${beforeInd + 1} | ` + lines[beforeInd] : "";

  const nextInd: number = position.start!.line!;
  const next =
    nextInd < lines.length ? ` ${nextInd + 1} | ` + lines[nextInd] : "";

  // prettier-ignore
  return `║ ${ansi(position.source!, BOLD)}
║ ${beforeBefore}
║ ${before}
║  ${position.start!.line} | ${YELLOW}${line}${RESET}
║      ${ansi(`${"~".repeat(pointerPosition || line.length)}${pointerPosition ? "^" : ""}${"~".repeat(pointerPosition || line.length)}`, CYAN)}
║ ${next}`;
};

export const reportError = (
  rules: Array<Property>,
  text: string = "is duplicated in the following places",
  selector?: string
) => {
  const rule = rules[0];

  const position = rule.position;

  if (!position || !position.source) {
    return console.error("Error in unknown file.");
  }

  // prettier-ignore
  console.log(`
╔══════════════════════════════════════════════════════════════════════════════════╗
║                                                                               ═══╩═══
${showInFile(rule.position, position.start!.column! + rule.property.length + 1)}
║
║ ${ansi(`\`${rule.property}: ${rule.value}\``, YELLOW)}${selector ? ` of ${ansi(selector, CYAN)}` : ""} ${text}:
║
║
${rules.slice(1).map(each => showInFile(each.position, (each.position.start!.column! + each.property.length + 1))).join(`\n║\n║ ${"=".repeat(40)}\n║\n`)}
║                                                                               ═══╦═══
╚══════════════════════════════════════════════════════════════════════════════════╝

`);
};

export const reportUnused = (ruleSet: RuleSet) => {
  const position = ruleSet.ruleSetPosition;

  if (!position || !position.source) {
    return console.error("Error in unknown file.");
  }

  // prettier-ignore
  console.log(`
╔══════════════════════════════════════════════════════════════════════════════════╗
║                                                                               ═══╩═══
║ Unused selector:
║
${showInFile(position, position.start?.column || undefined)}
║
╚══════════════════════════════════════════════════════════════════════════════════╝

`);
};
