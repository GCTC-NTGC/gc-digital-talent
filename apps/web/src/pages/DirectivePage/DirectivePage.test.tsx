import {
  renderWithProviders,
  expectNoAccessibilityErrors,
} from "@gc-digital-talent/vitest-helpers";

import DirectivePage from "./DirectivePage";

const renderDirectivePage = () => {
  return renderWithProviders(<DirectivePage />);
};

describe("DirectivePage", () => {
  it("should have no accessibility errors", async () => {
    const { container } = renderDirectivePage();
    await expectNoAccessibilityErrors(container);
  });
});
