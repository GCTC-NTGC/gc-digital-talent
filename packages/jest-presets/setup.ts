import { TextEncoder } from "util";
import { toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);

global.TextEncoder = TextEncoder;
