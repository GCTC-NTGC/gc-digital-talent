import { test, expect } from "~/fixtures";

test.describe("Graphiql", () => {
  test("Can submit a basic query", async ({ page }) => {
    await page.goto("/graphiql");

    const editorBox = page
      .getByRole("region", { name: "Query Editor" })
      .getByRole("textbox");
    await editorBox.focus();
    await page.keyboard.press("ControlOrMeta+A");
    await page.keyboard.press("Backspace");
    await page.keyboard.type("query {__typename}");

    const executeButton = page.getByRole("button", {
      name: "Execute query (Ctrl-Enter)",
    });
    await executeButton.click();

    const resultsBox = page.getByRole("region", { name: "Result Window" });
    await expect(resultsBox).toContainText('"__typename": "Query"');
  });
});
