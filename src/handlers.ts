import { join } from "path";
import { checkUnused } from "./check";
import { ansi, CYAN, RED } from "./constants";
import { deepCssParser, cssParser, deepParseHTML, parseHTML } from "./parser";
import { RuleSet } from "./types";
import { isDirectory } from "./utils";

/**
 *
 * @param cssPath Relative path to CSS file/directory containing CSS files
 * @param htmlPath Relative path to HTML file/directory containing HTML files
 * @param recursive
 * @returns Unused css rule sets
 */
export const handleUFlagResponse = async (
  cssPath: string,
  htmlPath: string,
  recursive: boolean
) => {
  const absoluteCssPath = join(process.cwd(), cssPath);

  let cssRulesets: RuleSet[] | null = null;

  try {
    cssRulesets = isDirectory(absoluteCssPath)
      ? await deepCssParser(cssPath, recursive)
      : cssParser(cssPath);
    if (!cssRulesets) {
      console.log(ansi("No rule sets are present in the given path.", CYAN));
      return [];
    }
  } catch (err) {
    console.log(ansi("Invalid Path", RED));
    return [];
  }

  const absoluteHTMLPath = join(process.cwd(), htmlPath);
  const HTMLData = isDirectory(absoluteHTMLPath)
    ? await deepParseHTML(htmlPath, recursive)
    : parseHTML(htmlPath);

  if (!HTMLData) {
    return [];
  }

  return checkUnused(cssRulesets, HTMLData);
};
