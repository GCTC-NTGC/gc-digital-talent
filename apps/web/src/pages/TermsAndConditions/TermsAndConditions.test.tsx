/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";

import { renderWithProviders, axeTest } from "@gc-digital-talent/jest-helpers";

import TermsAndConditions from "./TermsAndConditions";

const renderTermsAndConditions = () => {
  return renderWithProviders(<TermsAndConditions />);
};

describe("TermsAndConditions", () => {
  it("should have no accessibility errors", async () => {
    const { container } = renderTermsAndConditions();
    await axeTest(container);
  });
});
