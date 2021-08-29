import { CheerioAPI, load } from "cheerio";
import { promises } from "fs";
import { join } from "path";
import { ansi, RED } from "./constants";
import { inspect } from "util";
import { parse } from "@babel/parser";

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

  const {
    program: { body },
  } = parse(rawJSXFileContent, {
    sourceType: "module",
    allowImportExportEverywhere: true,
    plugins: ["jsx", "typescript"],
  });

  if (!silent) {
    console.log("body: ", inspect(body, true, null, true));
  }

  return load("<html></html>");
};
