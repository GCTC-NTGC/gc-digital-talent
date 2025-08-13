import { TextEncoder } from "util";

import { toHaveNoViolations } from "jest-axe";
import failOnConsole from "jest-fail-on-console";

failOnConsole();

expect.extend(toHaveNoViolations);

// @ts-expect-error: util.TextEncoder is compatible for our purposes in tests
global.TextEncoder = TextEncoder;
