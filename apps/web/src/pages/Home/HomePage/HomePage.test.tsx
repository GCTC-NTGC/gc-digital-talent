import {
  renderWithProviders,
  axeTest,
} from "@gc-digital-talent/vitest-helpers";

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
