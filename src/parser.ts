import { Declaration, parse, Rule } from "css";
import { readFileSync } from "fs";
import { join } from "path";
import strip from "strip-comments";
import { ansi, CYAN, RED, RESET, YELLOW } from "./constants";
import { PositionInfo, RuleSet } from "./types";

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

const readCss = (path: string) => {
  try {
    const data = readFileSync(join(__dirname, path));
    return data.toString();
  } catch (err) {
    return null;
  }
};

export const cssParser: (filePath: string) => Array<RuleSet> | null = (
  filePath: string
) => {
  const input = readCss(filePath);

  const source = join(__dirname, filePath);

  if (input === null) {
    console.error(`No such file or directory: ${ansi(source, RED)}`);
    return null;
  }

  const commentsRemoved = strip(input, { language: "css" });

  const rules: [Rule] = parse(commentsRemoved, { silent: true, source })
    .stylesheet?.rules as [Rule];

  if (!rules || !rules.length) {
    return null;
  }

  const res: Array<RuleSet> = [];

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
          position: position!,
        };
      }),
    });
  });
  return res;
};
