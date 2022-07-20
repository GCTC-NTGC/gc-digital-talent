/**
 * @jest-environment jsdom
 */

import React from "react";
import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import Accordion from "./Accordion";

expect.extend(toHaveNoViolations);

function renderAccordion() {
  return render(<Accordion title="Test Accordion" />);
}

describe("Accordion", () => {
  it("should not have accessibility errors", async () => {
    const { container } = renderAccordion();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
