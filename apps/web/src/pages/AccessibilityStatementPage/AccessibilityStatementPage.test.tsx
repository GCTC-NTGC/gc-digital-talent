/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import React from "react";
import { render, axeTest } from "@common/helpers/testUtils";

import AccessibilityStatementPage from "./AccessibilityStatementPage";

const renderAccessibilityStatementPage = () => {
  return render(<AccessibilityStatementPage />);
};

describe("AccessibilityStatementPage", () => {
  it("should have no accessibility errors", async () => {
    const { container } = renderAccessibilityStatementPage();
    await axeTest(container);
  });
});
