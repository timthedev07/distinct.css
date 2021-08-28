import { expect, test } from "@jest/globals";
import { preProcessRawHTML } from "../utils";

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
