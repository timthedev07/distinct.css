import { describe, test, expect } from "@jest/globals";
import { parseJSXFile } from "../jsx";

const BASE_DIR = "/test-data/react";
const REJECTED = BASE_DIR + "/rejected";

describe("Raw JSX file parsing", () => {
  test("successfully parses JSX", async () => {
    const parsed0 = await parseJSXFile(BASE_DIR + "/hello.jsx", true);
    const parsed1 = await parseJSXFile(BASE_DIR + "/hello.js", true);
    const parsed2 = await parseJSXFile(BASE_DIR + "/hello.tsx", true);
    expect(parsed0).toBeTruthy();
    expect(parsed1).toBeTruthy();
    expect(parsed2).toBeTruthy();
  });

  test("rejects invalid file extensions", async () => {
    const rejected0 = await parseJSXFile(REJECTED + "/hello.html", true);
    const rejected1 = await parseJSXFile(REJECTED + "/hello.svelte", true);
    expect(rejected0).toBeFalsy();
    expect(rejected1).toBeFalsy();
  });
});
