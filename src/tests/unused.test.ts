import { describe, test, expect } from "@jest/globals";
import { handleUFlagResponse } from "../handlers";

describe("Unused CSS selectors detection", () => {
  test("recognizes selectors with classes that are not present in the HTML", async () => {
    const result = await handleUFlagResponse(
      "/test-data/unused-css-detection/styles/0.css",
      "/test-data/unused-css-detection/pages/0.html",
      false
    );
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      selectors: [".some-other-heading"],
    });
  });
});
