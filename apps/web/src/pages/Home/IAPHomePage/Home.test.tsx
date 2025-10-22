import {
  renderWithProviders,
  axeTest,
} from "@gc-digital-talent/vitest-helpers";

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
