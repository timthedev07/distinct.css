import { lstatSync } from "fs";
import { ansi, RED } from "./constants";

/**
 *
 * @param path Absolute path
 * @returns
 */
export const isDirectory = (path: string) => lstatSync(path).isDirectory();

/**
 * What I do:
 *
 * - Remove <html> tags along with its closing tags
 * - Remove <head> section
 *
 * So this would result in leaving only the nodes inside of the body tag in the string
 *
 * @param rawHTML
 * @returns
 */
export const preProcessRawHTML = (rawHTML: string) => {
  let res = rawHTML;
  res = res.replace(/<html>/gi, "");
  res = res.replace(/<\/html>/gi, "");

  const headTagIndex = res.indexOf("<head>");

  if (headTagIndex > -1) {
    let closingHeadTagIndex = res.indexOf("</head>");
    if (closingHeadTagIndex === -1) {
      closingHeadTagIndex = res.indexOf("<body>");
    }

    if (closingHeadTagIndex === -1) {
      console.log(ansi("Please provide a valid body in you HTML.", RED));
      return "";
    }

    res = res.substr(0, headTagIndex) + res.substr(closingHeadTagIndex + 6);
  }

  return res;
};
