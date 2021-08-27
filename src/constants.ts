export const CYAN = "\x1b[36m";
export const RED = "\x1b[31m";
export const YELLOW = "\x1b[33m";
export const GREEN = "\x1b[32m";
export const RESET = "\x1b[0m";
export const BOLD = "\x1b[1m";

export const ansi = (
  text: string,
  ansiColor: string,
  bold: boolean = false
) => {
  return `${bold ? BOLD : ""}${ansiColor}${text}${RESET}`;
};

export const INVALID_PATH = `Please provide a valid directory/file path.\nType ${ansi(
  "`distinct.css -h`",
  CYAN
)} for help.\n`;

export const INVALID_CSS_PATH =
  "Please provide a valid path to a HTML file or a directory containing HTML files.";

export const INVALID_HTML_PATH =
  "Please provide a valid path to a CSS file or a directory containing CSS files.";
