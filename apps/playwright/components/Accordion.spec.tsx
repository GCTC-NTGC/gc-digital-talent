import { test, expect } from "@playwright/experimental-ct-react";
import AxeBuilder from "@axe-core/playwright";

import { Accordion } from "@gc-digital-talent/ui";

test("MyComponent should be accessible", async ({ mount, page }) => {
  // Mount the component
  await mount(
    <Accordion.Root type="single">
      <Accordion.Item value="one">
        <Accordion.Trigger>Accordion One</Accordion.Trigger>
        <Accordion.Content>
          <p>Some text</p>
        </Accordion.Content>
      </Accordion.Item>{" "}
      <Accordion.Item value="two">
        <Accordion.Trigger>Accordion Two</Accordion.Trigger>
        <Accordion.Content>
          <p>Some text</p>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>,
  );

  // Analyze for accessibility violations
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

  // Assert that no violations are found
  expect(accessibilityScanResults.violations).toEqual([]);
});
