import { test, expect } from "~/fixtures";

test.describe("Graphiql", () => {
  test("Can submit a basic query", async ({ page }) => {
    await page.goto("/graphiql");

    const editorBox = page
      .getByRole("region", { name: /query editor/i })
      .getByRole("textbox");
    await editorBox.focus();
    await page.keyboard.press("ControlOrMeta+A");
    await page.keyboard.press("Backspace");
    await page.keyboard.type("query {__typename}");

    const executeButton = page.getByRole("button", {
      name: /execute query/i,
    });
    await executeButton.click();

    const resultsBox = page.getByRole("region", { name: /result window/i });
    await expect(resultsBox).toContainText('"__typename": "Query"');
  });
});
