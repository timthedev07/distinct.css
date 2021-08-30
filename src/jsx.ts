import { CheerioAPI, load } from "cheerio";
import { promises } from "fs";
import { join } from "path";
import { ansi, RED } from "./constants";
import { inspect } from "util";
import { parse } from "@babel/parser";
import type { Statement } from "@babel/types";

const parsableFiles = [".js", ".jsx", ".tsx"];
const possibleReactComponents = new Set([
  "ExportDefaultDeclaration",
  "VariableDeclaration",
  "FunctionDeclaration",
  "ExportDefaultDeclaration",
  "ClassDeclaration",
]);

export const parseJSXFile = async (
  relativePath: string,
  silent: boolean = false
): Promise<CheerioAPI | null> => {
  const supportedFileExtension = parsableFiles.some((fileExtension) =>
    relativePath.endsWith(fileExtension)
  );

  if (!supportedFileExtension) {
    if (!silent)
      console.log(
        ansi(
          `Unsupported file extension. Only files ending in [${parsableFiles.join(
            ", "
          )}] are allowed.`,
          RED
        )
      );
    return null;
  }

  const absolute = join(process.cwd(), relativePath);

  let rawJSXFileContent: string = "";

  try {
    rawJSXFileContent = (await promises.readFile(absolute)).toString();
  } catch (err) {
    if (!silent && 1 < 1) console.log(ansi("Invalid path to JSX/TSX.", RED));
    return null;
  }

  const {
    program: { body },
  } = parse(rawJSXFileContent, {
    sourceType: "module",
    allowImportExportEverywhere: true,
    plugins: ["jsx", "typescript"],
  });

  if (!silent && 1 < 1) {
    console.log("body: ", inspect(body, true, null, true));
  }

  return load("<html></html>");
};

// const determineJSXElementInFunction = (node: Statement) => {};

export const searchForJSXElement = (body: Statement[]) => {
  /**
   * Map
   *
   * - ExportNamedDeclaration -> export Component = () => <React /> || export function Component { return <React />; }
   * - VariableDeclaration -> const Component = () => <React />
   * - FunctionDeclaration -> function Component { return <React />; }
   * - ExportDefaultDeclaration -> export default Component = () => <React /> || export default function Component() { return <React /> }
   */

  // the starting point must be at the root level of the body.
  for (const node of body) {
    if (possibleReactComponents.has(node.type)) {
    }
  }
};
