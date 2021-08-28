import { AtRule, Comment, Declaration, parse, Rule } from "css";
import { promises, readFileSync } from "fs";
import { join } from "path";
import { ansi, CYAN, INVALID_HTML_PATH, RED, RESET, YELLOW } from "./constants";
import { PositionInfo, RuleSet } from "./types";
import { load } from "cheerio";
import { isDirectory } from "./utils";
import { Element } from "domhandler";

const isRule = (value: Comment | Rule | AtRule): value is Rule => {
  return value.hasOwnProperty("selectors");
};

const isDeclaration = (value: Declaration | Comment): value is Declaration => {
  return value.hasOwnProperty("property");
};

const parseError = (position: PositionInfo) => {
  if (!position.source || !position.start?.line || !position.start?.column) {
    return console.error("Unknown error");
  }

  const line = readFileSync(position.source).toString().split("\n")[
    position.start.line - 1
  ];

  const blank = position.start.column - 1;

  console.error(`
Parsing error at ${YELLOW}line ${
    position.start?.line
  }${RESET} in file ${YELLOW}${position.source}${RESET}:

${line}
${" ".repeat(blank)}${ansi("~".repeat(line.length - blank), CYAN)}

  `);
};

const readFile = (path: string) => {
  try {
    const data = readFileSync(join(process.cwd(), path));
    return data.toString();
  } catch (err) {
    return null;
  }
};

export const cssParser: (filePath: string) => Array<RuleSet> | null = (
  filePath: string
) => {
  const input = readFile(filePath);

  const source = join(process.cwd(), filePath);

  if (input === null) {
    console.error(`No such file or directory: ${ansi(source, RED)}`);
    return null;
  }

  const rules: (Rule | Comment | AtRule)[] | undefined = parse(input, {
    silent: true,
    source,
  }).stylesheet?.rules;

  if (!rules || !rules.length) {
    return null;
  }

  const res: Array<RuleSet> = [];

  rules.forEach((each) => {
    // use the User Defined Type Guard to ensure the type is Rule
    // and also filter out Comment and AtRule
    if (!isRule(each)) return;
    if (!each.selectors || !each.selectors.length) return;
    if (!each.declarations || !each.declarations.length) return;

    const declarations: Declaration[] = each.declarations;

    res.push({
      selectors: each.selectors,
      rules: declarations
        .filter((item) => isDeclaration(item))
        .map((declaration) => {
          const { property, value, position }: Declaration = declaration;

          if (!property || !value) {
            parseError(position!);
            process.exit();
          }

          return {
            property,
            value,
            position: position!,
          };
        }),
    });
  });
  return res;
};

/**
 *
 * Iteratively parses all css files in the given directory and its sub directories `recursively`.
 *
 * @param dirName The relative path to the directory to where the file inside of it are going to be parsed.
 * @returns
 */
export const deepCssParser = async (
  dirName: string,
  recursive: boolean = true
) => {
  let res: RuleSet[] = [];
  let queue: string[] = []; // use queue rather than stack so that the resulting data would be ordered in ascending order
  let files = [];

  try {
    files = await promises.readdir(dirName);
  } catch (err) {
    return cssParser(dirName);
  }

  // initialize queue with filenames
  queue = queue.concat(files);

  while (queue.length) {
    // dequeue
    const last = queue.shift();

    if (!last) {
      break;
    }

    const relative = join(dirName, last);
    const absolute = join(process.cwd(), relative);

    if (isDirectory(absolute)) {
      if (recursive) {
        queue.push(
          ...(await promises.readdir(absolute)).map((each) => join(last, each))
        );
      }
      continue;
    }

    res = res.concat(cssParser(relative) || []);
  }
  return res;
};

/**
 *
 * @param path Absolute path to HTML file
 */
export const parseHTML = (path: string) => {
  let fileContent: string;

  try {
    fileContent = readFileSync(path).toString();
  } catch (err) {
    console.log(ansi("Invalid path to HTML file.", RED));
    return null;
  }

  const $ = load(fileContent);
  const elements = $("body *").get();

  return elements;
};

/**
 *
 * @param path Absolute path to the directory with HTML files
 * @param recursive Parse recursively if true
 */
export const deepParseHTML = async (
  path: string,
  recursive: boolean
): Promise<Element[] | null> => {
  let res: Element[] = [];
  let queue: string[] = []; // use queue rather than stack so that the resulting data would be ordered in ascending order
  let files: string[] = [];

  try {
    files = await promises.readdir(path);
  } catch (err) {
    if (isDirectory(path)) return parseHTML(path);
    console.log(INVALID_HTML_PATH);
    return null;
  }

  queue = queue.concat(files);

  while (queue.length) {
    const last = queue.shift();

    if (!last) {
      break;
    }

    const relative = join(path, last);
    const absolute = join(process.cwd(), relative);

    if (isDirectory(absolute)) {
      if (recursive) {
        queue.push(
          ...(await promises.readdir(absolute)).map((each) => join(last, each))
        );
      }
      continue;
    }

    res = res.concat(parseHTML(relative) || []);
  }
  return res;
};
