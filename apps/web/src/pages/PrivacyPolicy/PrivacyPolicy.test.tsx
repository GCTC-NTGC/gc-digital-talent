/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";

import { renderWithProviders, axeTest } from "@gc-digital-talent/jest-helpers";

import PrivacyPolicy from "./PrivacyPolicy";

const renderPrivacyPolicy = () => {
  return renderWithProviders(<PrivacyPolicy />);
};

describe("PrivacyPolicy", () => {
  it("should have no accessibility errors", async () => {
    const { container } = renderPrivacyPolicy();
    await axeTest(container);
  });
});
