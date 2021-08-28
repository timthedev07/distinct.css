import { CheerioAPI } from "cheerio";
import { inspect } from "util";
import { ansi, CYAN, GREEN, RED, YELLOW } from "./constants";
import { deepCssParser } from "./parser";
import { Property, RuleSet } from "./types";
import { reportError, reportUnused } from "./utils";

export const checkDir = async (
  path: string,
  checkConflict: boolean,
  recursive: boolean
) => {
  const cssData = await deepCssParser(path, recursive);

  if (!cssData) {
    return console.log(`No valid css rule are found in ${ansi(path, CYAN)}.`);
  }

  checkCss(path, cssData, checkConflict);
};

/**
 * The core of this algorithm is the string representations.
 *
 * @param path The path to the file you want to check
 * @param checkConflict Checks for conflicting rules when `checkConflict` === true
 * @returns nothing, but console logs the result
 */
export const checkFile = (
  path: string,
  checkConflict: boolean,
  cssData: RuleSet[] | null
) => {
  // if no rule sets are present
  if (!cssData) {
    return console.log(
      `File/directory ${ansi(path, CYAN)} doesn't have any css rules.`
    );
  }
  checkCss(path, cssData, checkConflict);
};

/**
 *
 * @param dirName Used for logging purposes
 * @param cssData The data to analyze
 * @param checkConflict Checks for conflicting rules when `checkConflict` === true
 * @returns
 */
export const checkCss = (
  dirName: string,
  cssData: RuleSet[],
  checkConflict: boolean
) => {
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
    console.log(
      `${ansi(
        `No duplicate rules found in ${ansi(dirName, YELLOW)}!`,
        GREEN,
        true
      )}`
    );
  } else {
    console.log(
      ansi(`Duplicate rules found in ${ansi(dirName, YELLOW)}:`, RED, true)
    );

    duplicates.forEach(([selector, val]) => {
      reportError(val, undefined, selector);
    });
  }

  if (!checkConflict) return;

  if (!hasConflict)
    return console.log(
      ansi(
        `No conflicting rules found in ${ansi(dirName, YELLOW)}!`,
        GREEN,
        true
      )
    );

  // filter out the ones that appeared only once
  for (let key of conflicts.keys()) {
    const val = conflicts.get(key);
    if (val && val[1].length < 2) conflicts.delete(key);
  }

  console.log(
    ansi(`Conflicting rules found in ${ansi(dirName, YELLOW)}:`, RED, true)
  );
  conflicts.forEach(([selector, val]) => {
    reportError(val, "conflicts with the following rules", selector);
  });
};

export const checkUnused = (cssFileContents: RuleSet[], $: CheerioAPI) => {
  // console.log(inspect(cssFileContents, false, 200, true));
  for (const ruleSet of cssFileContents) {
    ruleSet.selectors.forEach((each) => {
      if (each === "*") return;
      // if no such selector can be applied to any HTML elements
      if ($(each).get().length > 0) {
        reportUnused(ruleSet);
      }
    });
  }
};
