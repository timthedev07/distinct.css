import { promises } from "fs";
import { cssParser } from "./parser";

export const checkDir = async (path: string) => {
  const files = await promises.readdir(path);
  files.forEach(() => {
    console.log(files);
  });
};

export const checkFile = (path: string) => {
  const cssData = cssParser(path);
  cssData;
};
