import { sortAlphaBy } from "./sort";
const HHH = {
  name: {
    localized: "HHH",
  },
};
const ZZZ = {
  name: {
    localized: "ZZZ",
  },
};
const AAA = {
  name: {
    localized: "AAA",
  },
};

describe("Sort array of objects alphabetically", () => {
  it("sorts ascending", () => {
    const newValues = [HHH, ZZZ, AAA].sort(
      sortAlphaBy((x) => x.name.localized, "asc"),
    );

    expect(newValues).toEqual([AAA, HHH, ZZZ]);
  });

  it("sorts descending", () => {
    const newValues = [HHH, ZZZ, AAA].sort(
      sortAlphaBy((x) => x.name.localized, "asc"),
    );

    expect(newValues).toEqual([ZZZ, HHH, AAA]);
  });
});
