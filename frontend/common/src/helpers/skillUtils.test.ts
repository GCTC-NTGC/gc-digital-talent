/**
 * @jest-environment jsdom
 */

export {};

const x = 1;

describe("skill util tests", () => {
  test("THIS TEST SHOULD PASS", () => {
    expect(x).toEqual(1);
  });
  test("THIS TEST SHOULD FAIL", () => {
    expect(x).toEqual(2);
  });
});
