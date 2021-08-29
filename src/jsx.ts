import { CheerioAPI, load } from "cheerio";
import { promises } from "fs";
import { join } from "path";
import { parse as parseJSX } from "@babel/parser";

const parsableFiles = [".js", ".jsx", ".tsx"];
parsableFiles;

/**
 * @param content JSX content
 * @returns index
 */
export const findJSXStartingPosition = (content: string): number => {
  const re = /d/g;
  re;

  const ast = parseJSX(content);

  console.log(ast);

  return 0;
};

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

  return load("<html></html>");
};
