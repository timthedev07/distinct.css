import { expect, test, describe } from "@jest/globals";
import { preProcessRawHTML } from "../utils";

describe("Raw HTML Pre-processing function", () => {
  test("removes html tag", () => {
    const res = preProcessRawHTML(
      `
<!DOCTYPE html>
<html>
</html>
    `
    );
    expect(res.indexOf("<html>")).toBe(-1);
    expect(res.indexOf("</html>")).toBe(-1);
  });
});
