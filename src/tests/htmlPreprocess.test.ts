import { expect, test, describe } from "@jest/globals";
import { preProcessRawHTML } from "../utils";

describe("Raw HTML Preprocessing function", () => {
  test("removes html tag", () => {
    const processedHTML = preProcessRawHTML(`
<!DOCTYPE html>
<html>
</html>`);
    expect(processedHTML.indexOf("<html>")).toBe(-1);
    expect(processedHTML.indexOf("</html>")).toBe(-1);
  });

  test("removes entire head section", () => {
    const processedHTML0 = preProcessRawHTML(`
<!DOCTYPE html>
<html>
  <head>
    <title>Some title</title>
    <meta name="description" content="some dummy html" />
  </head>
  <body>

  </body>
</html>`);

    // head tags
    expect(processedHTML0.indexOf("<head>")).toBe(-1);
    expect(processedHTML0.indexOf("</head>")).toBe(-1);

    // content inside
    expect(processedHTML0.indexOf("<title>")).toBe(-1);
    expect(processedHTML0.indexOf("</title>")).toBe(-1);
    expect(processedHTML0.indexOf("<meta")).toBe(-1);
  });
});
