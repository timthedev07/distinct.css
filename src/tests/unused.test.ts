import { describe, test, expect } from "@jest/globals";
import { handleUFlagResponse } from "../handlers";

describe("Unused CSS selectors detection", () => {
  describe("correctly identifies used selectors", () => {
    test("recognizes class selectors", async () => {
      const result = await handleUFlagResponse(
        "/test-data/unused-css-detection/styles/0.css",
        "/test-data/unused-css-detection/pages/0.html",
        false
      );

      // expected to have no unused css
      expect(result).toHaveLength(0);
    });

    test("recognizes id selectors", async () => {
      const result = await handleUFlagResponse(
        "/test-data/unused-css-detection/styles/1.css",
        "/test-data/unused-css-detection/pages/1.html",
        false
      );

      // expected to have no unused css
      expect(result).toHaveLength(0);
    });

    test("recognizes element selectors", async () => {
      const result = await handleUFlagResponse(
        "/test-data/unused-css-detection/styles/2.css",
        "/test-data/unused-css-detection/pages/2.html",
        false
      );

      // expected to have no unused css
      expect(result).toHaveLength(0);
    });
  });
});
