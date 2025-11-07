import {
  renderWithProviders,
  expectNoAccessibilityErrors,
} from "@gc-digital-talent/vitest-helpers";

import TermsAndConditions from "./TermsAndConditions";

const renderTermsAndConditions = () => {
  return renderWithProviders(<TermsAndConditions />);
};

describe("TermsAndConditions", () => {
  it("should have no accessibility errors", async () => {
    const { container } = renderTermsAndConditions();
    await expectNoAccessibilityErrors(container);
  });
});
