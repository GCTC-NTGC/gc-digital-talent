import { axe } from "vitest-axe";

const axeTest = async (container: HTMLElement) => {
  const results = await axe(container);
  expect(results).toHaveNoViolations();
};

export default axeTest;
