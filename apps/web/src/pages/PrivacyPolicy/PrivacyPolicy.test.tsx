import {
  renderWithProviders,
  expectNoAccessibilityErrors,
} from "@gc-digital-talent/vitest-helpers";

import PrivacyPolicy from "./PrivacyPolicy";

const renderPrivacyPolicy = () => {
  return renderWithProviders(<PrivacyPolicy />);
};

describe("PrivacyPolicy", () => {
  it("should have no accessibility errors", async () => {
    const { container } = renderPrivacyPolicy();
    await expectNoAccessibilityErrors(container);
  });
});
