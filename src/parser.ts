import { Declaration, parse, Rule, Position } from "css";
import { readFileSync } from "fs";
import { join } from "path";
import strip from "strip-comments";
import { CYAN, RED, RESET, YELLOW } from "./index";

interface Property {
  property: string;
  value: string;
}

interface Ruleset {
  selectors: Array<string>;
  rules: Array<Property>;
}

interface PositionInfo {
  start?: Position | undefined;
  end?: Position | undefined;
  source?: string | undefined;
  content?: string | undefined;
}

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
${" ".repeat(blank)}${CYAN}${"~".repeat(line.length - blank)}${CYAN}

  `);
};

const readCss = (path: string) => {
  try {
    const data = readFileSync(join(__dirname, path));
    return data.toString();
  } catch (err) {
    return null;
  }
};

export const cssParser: (filePath: string) => Array<Ruleset> | null = (
  filePath: string
) => {
  const input = readCss(filePath);

  const source = join(__dirname, filePath);

  if (!input) {
    console.error(`No such file or directory: ${RED}${source}${RESET}`);
    return null;
  }

  const commentsRemoved = strip(input, { language: "css" });

  const rules: [Rule] = parse(commentsRemoved, { silent: true, source })
    .stylesheet?.rules as [Rule];

  if (!rules) {
    return null;
  }

  const res: Array<Ruleset> = [];

  rules.forEach((each) => {
    if (!each.selectors || !each.selectors.length) return;
    if (!each.declarations || !each.declarations.length) return;

    res.push({
      selectors: each.selectors,
      rules: each.declarations.map((declaration) => {
        const { property, value, position }: Declaration = declaration;

        if (!property || !value) {
          parseError(position!);
          process.exit();
        }

        return {
          property,
          value,
        };
      }),
    });
  });
  return res;
};
