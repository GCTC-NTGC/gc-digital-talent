import "axe-core";
import { AxeMatchers } from "vitest-axe";

declare module "vitest" {
  interface Assertion extends AxeMatchers {}
  interface AsymmetricMatchersContaining extends AxeMatchers {}
}
