#!/usr/bin/env node

import { join } from "path";
import yargs from "yargs";
import { checkDir, checkFile } from "./check";
import { INVALID_CSS_PATH, INVALID_HTML_PATH, INVALID_PATH } from "./constants";
import { cssParser } from "./parser";
import { prompt } from "inquirer";
import { RemoveUnusedAnswerType } from "./types";
import { isDirectory } from "./utils";
import { handleUFlagResponse } from "./handlers";

const parser = yargs(process.argv.slice(2))
  .options({
    f: { type: "string", default: "" },
    c: { type: "boolean", default: false },
    r: { type: "boolean", default: true },
    u: { type: "boolean", default: false },
  })
  .usage("Usage: $0 -f [path]")
  .example(
    "$0 -f button.css",
    "searches for duplicate css rules in file button.css"
  )
  .example(
    "$0 -r -f css/",
    "recursively searches for duplicate css rules in the css directory"
  )
  .example(
    "$0 -c -f conflicts.css",
    "searches for duplicate and conflicting css rules in conflicts.css"
  )
  .example(
    "$0 -u",
    "detect unused css, more information will be prompt when command executes"
  )
  .alias("f", "file")
  .alias("f", "d")
  .alias("f", "directory")
  .nargs("f", 1)
  .describe("f", "File/directory to check")
  .demandOption(["f"])
  .alias("c", "showConflict")
  .describe("c", "Show conflicting rules")
  .boolean("c")
  .alias("r", "recursive")
  .describe("r", "Recursively search in a directory")
  .boolean("r")
  .alias("u", "detectUnused")
  .describe(
    "u",
    "Check for unused css rules. Note that if this flag is passed, all the other ones would be ignored since it behaves differently."
  )
  .alias("v", "version")
  .help("h")
  .alias("h", "help");

(async () => {
  const argv = await parser.argv;

  if (argv.u) {
    const { cssPath, htmlPath, recursive } =
      await prompt<RemoveUnusedAnswerType>([
        {
          name: "cssPath",
          type: "input",
          message: "Path to CSS:",
        },
        {
          name: "htmlPath",
          type: "input",
          message: "Path to HTML:",
        },
        {
          name: "recursive",
          type: "confirm",
          message: "Recursive? [N]",
          default: false,
        },
      ]);

    if (!cssPath) return console.log(INVALID_CSS_PATH);
    if (!htmlPath) return console.log(INVALID_HTML_PATH);

    handleUFlagResponse(cssPath, htmlPath, recursive);
  } else {
    const path = argv.f;
    if (!path) return console.error(INVALID_PATH);

    // checking if the path is a file or a directory
    let isDir: boolean = false;

    try {
      isDir = isDirectory(join(process.cwd(), path));
    } catch (err) {
      console.error(INVALID_PATH, err);
    }

    if (isDir) {
      checkDir(path, argv.showConflict, argv.recursive);
    } else {
      const cssData = cssParser(path);
      checkFile(path, argv.showConflict, cssData);
    }
  }
})();
