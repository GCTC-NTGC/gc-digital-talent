/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";

import { renderWithProviders, axeTest } from "@gc-digital-talent/jest-helpers";

import DirectivePage from "./DirectivePage";

const renderDirectivePage = () => {
  return renderWithProviders(<DirectivePage />);
};

describe("DirectivePage", () => {
  it("should have no accessibility errors", async () => {
    const { container } = renderDirectivePage();
    await axeTest(container);
  });
});
