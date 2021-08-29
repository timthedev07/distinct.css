import { CheerioAPI, load } from "cheerio";
import { promises } from "fs";
import { join } from "path";
import { Parser } from "acorn";
import jsx from "acorn-jsx";
import { ansi, RED } from "./constants";

const parsableFiles = [".js", ".jsx", ".tsx"];

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
    if (!silent) console.log(ansi("Invalid path to JSX/TSX.", RED));
    return null;
  }

  const extendedParser = Parser.extend(jsx());

  const parsed = extendedParser.parse(rawJSXFileContent, {
    ecmaVersion: "latest",
    sourceType: "module",
    allowImportExportEverywhere: true,
  });

  if (!silent) console.log(parsed);

  return load("<html></html>");
};
