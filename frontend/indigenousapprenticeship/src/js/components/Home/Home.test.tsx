/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import React from "react";
import { render, axeTest } from "@common/helpers/testUtils";

import Home from "./Home";

const renderHome = () => render(<Home />);

describe("Basic test for Home", () => {
  it("should render", () => {
    renderHome();
  });

  it("should have no accessibility errors", async () => {
    const { container } = renderHome();

    await axeTest(container);
  });
});
