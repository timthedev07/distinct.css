import { lstatSync } from "fs";

/**
 *
 * @param path Absolute path
 * @returns
 */
export const isDirectory = (path: string) => lstatSync(path).isDirectory();
