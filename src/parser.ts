import { Declaration, parse, Rule, Position } from "css";
import { readFileSync } from "fs";
import { join } from "path";
import strip from "strip-comments";

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
  console.log(position);
};

const readCss = (path: string) => {
  try {
    const data = readFileSync(join(__dirname, path));

    return data.toString();
  } catch (err) {
    return null;
  }
};

export const customParser: (filePath: string) => Array<Ruleset> | null = (
  filePath: string
) => {
  const input = readCss(filePath);

  const source = join(__dirname, filePath);

  if (!input) {
    console.error(`No such file or directory: ${source}`);
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

console.log(customParser("../test.css"));
