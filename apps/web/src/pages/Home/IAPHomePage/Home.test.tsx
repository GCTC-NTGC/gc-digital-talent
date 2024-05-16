/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";

import { renderWithProviders, axeTest } from "@gc-digital-talent/jest-helpers";

import { Home } from "./Home";

const renderHome = () => renderWithProviders(<Home />);

describe("Basic test for Home", () => {
  it("should render", () => {
    renderHome();
  });

  it("should have no accessibility errors", async () => {
    const { container } = renderHome();

    await axeTest(container);
  });
});
