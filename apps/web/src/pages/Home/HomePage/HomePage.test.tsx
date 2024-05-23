/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";

import { renderWithProviders, axeTest } from "@gc-digital-talent/jest-helpers";

import HomePage from "./HomePage";

const renderHomepage = () => {
  return renderWithProviders(<HomePage />);
};

describe("DigitalTalentHomePage", () => {
  it("should have no accessibility errors", async () => {
    const { container } = renderHomepage();
    await axeTest(container);
  });
});
