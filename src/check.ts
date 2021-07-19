import { promises, readFileSync } from "fs";
import { GREEN, RESET, YELLOW } from "./index";
import { cssParser, Property } from "./parser";

const reportDuplicate = (rules: Array<Property>) => {
  const rule = rules[0];

  const position = rule.position;

  if (!position || !position.source) {
    return console.error("Error in unknown file.");
  }

  const lines = readFileSync(position.source).toString().split("\n");

  const line = lines[rule.position.start!.line! - 1];

  const beforeBeforeInd: number = rule.position.start!.line! - 3;
  const beforeBefore =
    beforeBeforeInd > -1
      ? ` ${beforeBeforeInd + 1} | ` + lines[beforeBeforeInd]
      : "";

  const beforeInd: number = rule.position.start!.line! - 2;
  const before =
    beforeInd > -1 ? ` ${beforeInd + 1} | ` + lines[beforeInd] : "";

  const nextInd: number = rule.position.start!.line!;
  const next =
    nextInd < lines.length ? ` ${nextInd + 1} | ` + lines[nextInd] : "";

  // prettier-ignore
  console.log(`
Found duplicate property ${rule.property} in file ${position.source}:
╔══════════════════════════════════════════════════════════════════════════════════╗
║                                                                               ═══╩═══
║ ${beforeBefore}
║ ${before}                                                                         
║  ${position.start!.line} | ${line}                                                
║      ${"~".repeat(line.length + 8)}                                                      
║ ${next}                                                                           
║                                                                                   
║ \`${rule.property}: ${rule.value}\` is duplicated in the following places:            
║                                                                                  
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
      `File ${YELLOW}${path}${RESET} does not contain any css rules.`
    );
  }

  const seen: Set<string> = new Set([]);
  let hasDup = false;
  const duplicates: Map<string, Array<Property>> = new Map();

  // iterating over the rule sets
  // and finding duplicates based on `seen`
  cssData.forEach((ruleSet) => {
    ruleSet.selectors.forEach((selector) => {
      ruleSet.rules.forEach((rule) => {
        const item = `${selector} ${rule.property}  ${rule.value}`;
        if (seen.has(item)) {
          // found duplicate
          const existing = duplicates.get(item);
          hasDup = true;
          duplicates.set(item, !existing ? [rule] : [...existing, rule]);
        } else {
          seen.add(item);
        }
      });
    });
  });

  duplicates.forEach((val) => {
    reportDuplicate(val);
  });

  if (!hasDup) {
    console.log(`${GREEN}No duplicate rules found!${RESET}`);
  } else {
  }

  if (!checkConflict) return;
};
