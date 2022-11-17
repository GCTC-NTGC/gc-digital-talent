/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { axe } from "jest-axe";
import React from "react";
import { render } from "@common/helpers/testUtils";
import HomePage from "./HomePage";

const renderHomePage = () => render(<HomePage />);

describe("Basic test for Home Page", () => {
  it("should render", () => {
    renderHomePage();
  });

  it("should have no accessibility errors", async () => {
    const { container } = renderHomePage();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
