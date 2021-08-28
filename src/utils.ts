import { lstatSync } from "fs";

/**
 *
 * @param path Absolute path
 * @returns
 */
export const isDirectory = (path: string) => lstatSync(path).isDirectory();

/**
 * What I do:
 *
 * - Remove <html>, <body> tags along with their closing tags
 * - Remove <head> section
 *
 * So this would result in leaving only the nodes inside of the body tag in the string
 *
 * @param rawHTML
 * @returns
 */
export const preProcessRawHTML = (rawHTML: string) => {
  return "";
};
