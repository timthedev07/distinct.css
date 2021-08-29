import { CheerioAPI, load } from "cheerio";
import { promises } from "fs";
import { join } from "path";
import { Parser } from "acorn";
import jsx from "acorn-jsx";

const parsableFiles = [".js", ".jsx", ".tsx"];
parsableFiles;

export const parseJSXFile = async (
  relativePath: string
): Promise<CheerioAPI | null> => {
  if (!relativePath.endsWith(".js")) {
    // incorrect file extension
  }
  const absolute = join(process.cwd(), relativePath);

  let rawJSXFileContent: string = "";

  try {
    rawJSXFileContent = (await promises.readFile(absolute)).toString();
  } catch (err) {
    return null;
  }

  const re = /d/g;
  re;

  const extendedParser = Parser.extend(jsx());

  const parsed = extendedParser.parse(rawJSXFileContent, {
    ecmaVersion: "latest",
    sourceType: "module",
    allowImportExportEverywhere: true,
  });

  console.log(parsed);

  return load("<html></html>");
};
