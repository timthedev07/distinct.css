import { lstatSync } from "fs";
import yargs from "yargs";
import { checkDir, checkFile } from "./check";

const parser = yargs(process.argv.slice(2))
  .options({
    f: { type: "string" },
    c: { type: "boolean", default: false },
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
  .nargs("c", 2)
  .describe("c", "Show conflicting rules if there is any")
  .alias("v", "version")
  .help("h")
  .alias("h", "help");

export const CYAN = "\x1b[36m";
export const RED = "\x1b[31m";
export const YELLOW = "\x1b[33m";
export const RESET = "\x1b[0m";
export const BOLD = "\x1b[31m";

export const INVALID_PATH = `Please provide a valid directory/file path.\nType ${CYAN}\`distinct.css -h\`${RESET} for help.\n`;

(async () => {
  const argv = await parser.argv;
  const path = argv.f;
  if (!path) return console.error(INVALID_PATH);

  // checking if the path is a file or a directory
  let type: string = "file";

  try {
    type = lstatSync(path).isDirectory() ? "dir" : "file";
  } catch (err) {
    console.error(INVALID_PATH, err);
  }

  // if the given path is a directory,
  // we iterate over the files and check one by one(in the checkdir function)
  if (type === "dir") {
    checkDir(path);
    return;
  }
  checkFile(path);
})();
