import { promises, readFileSync } from "fs";
import { ansi, BOLD, CYAN, GREEN, RESET, YELLOW } from "./constants";
import { cssParser } from "./parser";
import { PositionInfo, Property } from "./types";

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
  return `║ ${beforeBefore}
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
║ ${ansi(`\`${rule.property}: ${rule.value}\``, YELLOW)}${selector ? ` of ${ansi(selector, GREEN)}` : ""} ${text}:
║
║
${rules.slice(1).map(each => showInFile(each.position, (each.position.start!.column! + each.property.length + 1))).join(`\n║\n║ ${"=".repeat(40)}\n║\n`)}
║                                                                               ═══╦═══
╚══════════════════════════════════════════════════════════════════════════════════╝

`);
};

export const checkDir = async (path: string) => {
  const files = await promises.readdir(path);
  files.forEach(() => {
    console.log(files);
  });
};

/**
 * The core of this algorithm is the string representations.
 *
 * @param path The path to the file you want to check
 * @param checkConflict Checks for conflicting rules when `checkConflict` === true
 * @returns nothing, but console logs the result
 */
export const checkFile = (path: string, checkConflict: boolean) => {
  const cssData = cssParser(path);

  // if not rule sets are present
  if (!cssData) {
    return console.log(
      `File ${ansi(path, CYAN)} does not contain any css rules.`
    );
  }

  let hasDup = false;
  let hasConflict = false;
  const duplicates: Map<string, [string, Array<Property>]> = new Map();
  const conflicts: Map<string, [string, Array<Property>]> = new Map(); // map `selector property` to `value`

  // iterating over the rule sets
  // and finding duplicates based on `seen`
  cssData.forEach((ruleSet) => {
    ruleSet.selectors.forEach((selector) => {
      ruleSet.rules.forEach((rule) => {
        const strRepresentation = `${selector} ${rule.property}{${rule.value}`;

        const existing = duplicates.get(strRepresentation);
        if (existing) {
          // found duplicate
          hasDup = true;
          duplicates.set(
            strRepresentation,
            existing ? [selector, [...existing[1], rule]] : [selector, [rule]]
          );
        } else {
          duplicates.set(strRepresentation, [selector, [rule]]);
        }

        if (!checkConflict) return;
        // now it's the part of finding conflicts

        const [first] = strRepresentation.split("{");

        const prev = conflicts.get(first);

        // if there is already a value for this particular rule for this particular selector,
        // and it is not a duplicate
        if (prev && !prev[1].find((item) => item.value === rule.value)) {
          // found conflicting rules on the same selector
          hasConflict = true;
          conflicts.set(first, [selector, [...prev[1], rule]]);
        } else {
          conflicts.set(first, [selector, [rule]]);
        }
      });
    });
  });

  // filter out the ones that appeared only once
  for (let key of duplicates.keys()) {
    const val = duplicates.get(key);
    if (val && val[1].length < 2) duplicates.delete(key);
  }

  if (!hasDup) {
    console.log(`${ansi("No duplicate rules found!", GREEN)}`);
  } else {
    console.log(ansi(`Duplicate rules found on ${ansi(path, YELLOW)}:`, BOLD));

    duplicates.forEach(([selector, val]) => {
      reportError(val, undefined, selector);
    });
  }

  if (!checkConflict) return;

  if (!hasConflict)
    return console.log(ansi("No conflicting rules found!", GREEN));

  // filter out the ones that appeared only once
  for (let key of conflicts.keys()) {
    const val = conflicts.get(key);
    if (val && val[1].length < 2) conflicts.delete(key);
  }

  if (!hasDup) {
    console.log(ansi(path, YELLOW));
  }

  console.log(ansi(`Conflicting rules found on ${YELLOW + path}:`, BOLD));
  conflicts.forEach(([selector, val]) => {
    reportError(val, "conflicts with the following rules", selector);
  });
};
