#!/usr/bin/env node

import { lstatSync } from "fs";
import { join } from "path";
import yargs from "yargs";
import { checkDir, checkFile } from "./check";
import { INVALID_PATH } from "./constants";
import { cssParser } from "./parser";

const parser = yargs(process.argv.slice(2))
  .options({
    f: { type: "string" },
    c: { type: "boolean", default: false },
    r: { type: "boolean", default: true },
  })
  .usage("Usage: $0 -f [path]")
  .example(
    "$0 -f button.css",
    "- searches for duplicate css rules in file button.css"
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
  .alias("v", "version")
  .help("h")
  .alias("h", "help");

(async () => {
  const argv = await parser.argv;
  const path = argv.f;
  if (!path) return console.error(INVALID_PATH);

  // checking if the path is a file or a directory
  let type: string = "file";

  try {
    type = lstatSync(join(process.cwd(), path)).isDirectory() ? "dir" : "file";
  } catch (err) {
    console.error(INVALID_PATH, err);
  }

  if (type === "dir") {
    checkDir(path, argv.showConflict, argv.recursive);
    return;
  }
  const cssData = cssParser(path);
  checkFile(path, argv.showConflict, cssData);
})();
