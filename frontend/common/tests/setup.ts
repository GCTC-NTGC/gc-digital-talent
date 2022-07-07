import { toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);


// source: https://stackoverflow.com/a/49591765
global.console = {
  ...console,
  // uncomment to ignore a specific log level
  //log: jest.fn(),
  //debug: jest.fn(),
  //info: jest.fn(),
  //warn: jest.fn(),
  //error: jest.fn(),
};
