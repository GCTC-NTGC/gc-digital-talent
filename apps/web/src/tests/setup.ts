import { toHaveNoViolations } from "jest-axe";
import failOnConsole from "jest-fail-on-console";

failOnConsole();

expect.extend(toHaveNoViolations);
