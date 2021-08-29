import { CheerioAPI, load } from "cheerio";
import { promises } from "fs";
import { join } from "path";
import { Parser } from "acorn";
import jsx from "acorn-jsx";
import { ansi, RED } from "./constants";

const parsableFiles = [".js", ".jsx", ".tsx"];
parsableFiles;

export const parseJSXFile = async (
  relativePath: string
): Promise<CheerioAPI | null> => {
  for (const fileExtension of parsableFiles) {
    if (!relativePath.endsWith(fileExtension)) {
      console.log(ansi("Unsupported file extension[.js, .jsx, .tsx]", RED));
      return null;
    }
  }

  const absolute = join(process.cwd(), relativePath);

  let rawJSXFileContent: string = "";

  try {
    rawJSXFileContent = (await promises.readFile(absolute)).toString();
  } catch (err) {
    console.log(ansi("Invalid path to JSX/TSX.", RED));
    return null;
  }

  const extendedParser = Parser.extend(jsx());

  const parsed = extendedParser.parse(rawJSXFileContent, {
    ecmaVersion: "latest",
    sourceType: "module",
    allowImportExportEverywhere: true,
  });

  console.log(parsed);

  return load("<html></html>");
};
