import { promises, readFileSync } from "fs";
import { ansi, CYAN, GREEN, RESET, YELLOW } from "./constants";
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

export const reportDuplicate = (rules: Array<Property>) => {
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
║ \`${rule.property}: ${rule.value}\` is duplicated in the following places:
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

export const checkFile = (path: string, checkConflict: boolean) => {
  const cssData = cssParser(path);

  // if not rule sets are present
  if (!cssData) {
    return console.log(
      `File ${ansi(path, CYAN)} does not contain any css rules.`
    );
  }

  let hasDup = false;
  const duplicates: Map<string, Array<Property>> = new Map();

  // iterating over the rule sets
  // and finding duplicates based on `seen`
  cssData.forEach((ruleSet) => {
    ruleSet.selectors.forEach((selector) => {
      ruleSet.rules.forEach((rule) => {
        const item = `${selector} ${rule.property}  ${rule.value}`;

        const existing = duplicates.get(item);
        if (existing) {
          // found duplicate

          hasDup = true;
          duplicates.set(item, existing ? [...existing, rule] : [rule]);
        } else {
          duplicates.set(item, [rule]);
        }
      });
    });
  });

  // filter out the ones that appeared only once
  for (let key of duplicates.keys()) {
    const val = duplicates.get(key);
    if (val && val.length < 2) duplicates.delete(key);
  }

  duplicates.forEach((val) => {
    // console.log(`${YELLOW}${val[0].position.source}${RESET}:`);
    reportDuplicate(val);
  });

  if (!hasDup) {
    console.log(`${GREEN}No duplicate rules found!${RESET}`);
  } else {
  }

  if (!checkConflict) return;
};
