/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import React from "react";
import { render, axeTest } from "@common/helpers/testUtils";

import HomePage from "./HomePage";

const renderHomepage = () => {
  return render(<HomePage />);
};

describe("DigitalTalentHomePage", () => {
  it("should have no accessibility errors", async () => {
    const { container } = renderHomepage();
    await axeTest(container);
  });
});
