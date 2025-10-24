import {
  renderWithProviders,
  axeTest,
} from "@gc-digital-talent/vitest-helpers";

import AccessibilityStatementPage from "./AccessibilityStatementPage";

const renderAccessibilityStatementPage = () => {
  return renderWithProviders(<AccessibilityStatementPage />);
};

describe("AccessibilityStatementPage", () => {
  it("should have no accessibility errors", async () => {
    const { container } = renderAccessibilityStatementPage();
    await axeTest(container);
  });
});
