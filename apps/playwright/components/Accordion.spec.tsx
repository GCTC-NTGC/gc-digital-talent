import { test, expect } from "@playwright/experimental-ct-react";
import AxeBuilder from "@axe-core/playwright";

import { Accordion } from "@gc-digital-talent/ui";

test("MyComponent should be accessible", async ({ mount, page }) => {
  // Mount the component
  await mount(
    <main>
      <h1>Test</h1>
      <Accordion.Root type="single" mode="card">
        <Accordion.Item value="one">
          <Accordion.Trigger subtitle="Subtitle">Accordion One</Accordion.Trigger>
          <Accordion.Content>
            <p>Some text</p>
          </Accordion.Content>
        </Accordion.Item>{" "}
      </Accordion.Root>
    </main>,
  );

  // Analyze for accessibility violations
  const accessibilityScanResults = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'])
    .analyze();

  // Assert that no violations are found
  expect(accessibilityScanResults.violations).toEqual([]);
});
