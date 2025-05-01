import { sortAlphaBy } from "./sort";

const values = [
  {
    name: {
      localized: "HHH",
    },
  },
  {
    name: {
      localized: "ZZZ",
    },
  },
  {
    name: {
      localized: "AAA",
    },
  },
];

describe("Sort array of objects alphabetically", () => {
  it("sorts ascending", () => {
    const newValues = values.sort(sortAlphaBy((x) => x.name.localized, "asc"));

    expect(newValues).toEqual([
      {
        name: {
          localized: "AAA",
        },
      },
      {
        name: {
          localized: "HHH",
        },
      },
      {
        name: {
          localized: "ZZZ",
        },
      },
    ]);
  });

  it("sorts descending", () => {
    const newValues = values.sort(sortAlphaBy((x) => x.name.localized, "desc"));

    expect(newValues).toEqual([
      {
        name: {
          localized: "ZZZ",
        },
      },
      {
        name: {
          localized: "HHH",
        },
      },
      {
        name: {
          localized: "AAA",
        },
      },
    ]);
  });
});
