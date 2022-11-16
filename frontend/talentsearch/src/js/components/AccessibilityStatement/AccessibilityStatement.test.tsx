/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import React from "react";
import { render, axeTest } from "@common/helpers/testUtils";

import AccessibilityStatement from "./AccessibilityStatement";

const renderAccessibilityStatement = () => {
  return render(<AccessibilityStatement />);
};

describe("DigitalTalentAccessibilityStatement", () => {
  it("should have no accessibility errors", async () => {
    const { container } = renderAccessibilityStatement();
    await axeTest(container);
  });
});
