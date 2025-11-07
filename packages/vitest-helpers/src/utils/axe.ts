import { expect } from "vitest";
import { axe } from "vitest-axe";

const expectNoAccessibilityErrors = async (container: HTMLElement) => {
  const results = await axe(container);
  expect(results).toHaveNoViolations();
};

export default expectNoAccessibilityErrors;
