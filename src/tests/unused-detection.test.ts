import { describe, test, expect } from "@jest/globals";
import { handleUFlagResponse } from "../handlers";

const BASE_DIR = "/test-data/unused-css-detection";
const NO_UNUSED_BASE_DIR = BASE_DIR + "/no-unused";

describe("Unused CSS selectors detection", () => {
  describe("correctly identifies used selectors", () => {
    test("recognizes class selectors", async () => {
      const result = await handleUFlagResponse(
        NO_UNUSED_BASE_DIR + "/styles/0.css",
        NO_UNUSED_BASE_DIR + "/pages/0.html",
        false
      );

      // expected to have no unused css
      expect(result).toHaveLength(0);
    });

    test("recognizes id selectors", async () => {
      const result = await handleUFlagResponse(
        NO_UNUSED_BASE_DIR + "/styles/1.css",
        NO_UNUSED_BASE_DIR + "/pages/1.html",
        false
      );
      expect(result).toHaveLength(0);
    });

    test("recognizes element selectors", async () => {
      const result = await handleUFlagResponse(
        NO_UNUSED_BASE_DIR + "/styles/2.css",
        NO_UNUSED_BASE_DIR + "/pages/2.html",
        false
      );
      expect(result).toHaveLength(0);
    });

    test("recognizes element.class#id selectors", async () => {
      const result = await handleUFlagResponse(
        NO_UNUSED_BASE_DIR + "/styles/3.css",
        NO_UNUSED_BASE_DIR + "/pages/3.html",
        false
      );
      expect(result).toHaveLength(0);
    });

    test("recognizes descendant elements and immediate children", async () => {
      const result = await handleUFlagResponse(
        NO_UNUSED_BASE_DIR + "/styles/4.css",
        NO_UNUSED_BASE_DIR + "/pages/4.html",
        false
      );
      expect(result).toHaveLength(0);
    });

    test("recognizes attributes", async () => {
      const result = await handleUFlagResponse(
        NO_UNUSED_BASE_DIR + "/styles/5.css",
        NO_UNUSED_BASE_DIR + "/pages/5.html",
        false
      );
      expect(result).toHaveLength(0);
    });
  });
});
