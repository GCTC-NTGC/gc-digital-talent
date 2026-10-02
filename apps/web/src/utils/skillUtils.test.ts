import { toLocalizedEnum } from "@gc-digital-talent/fake-data";
import { SkillCategory } from "@gc-digital-talent/graphql";

import { invertSkillSkillFamilyTree, parseKeywords } from "./skillUtils";

const localizedBehavioural = toLocalizedEnum(
  SkillCategory.Behavioural,
  "LocalizedSkillCategory",
);

const localizedString = { __typename: "LocalizedString" as const };

describe("skill util tests", () => {
  test("inverts a skill tree with a single skill in a single family", () => {
    const skills = [
      {
        id: "1",
        key: "skill_one",
        name: localizedString,
        category: localizedBehavioural,
        families: [
          {
            id: "1",
            key: "family_one",
            name: localizedString,
            description: localizedString,
            skills: [],
          },
        ],
      },
    ];
    const expected = [
      {
        id: "1",
        key: "family_one",
        name: localizedString,
        description: localizedString,
        skills: [
          {
            id: "1",
            key: "skill_one",
            name: localizedString,
            category: localizedBehavioural,
            families: [],
          },
        ],
      },
    ];
    const actual = invertSkillSkillFamilyTree(skills);
    expect(actual).toEqual(expected);
  });
  test("inverts a skill tree with three skills in a single family", () => {
    const skills = [
      {
        id: "1",
        key: "skill_one",
        name: localizedString,
        category: localizedBehavioural,
        families: [
          {
            id: "1",
            key: "family_one",
            name: localizedString,
            description: localizedString,
            skills: [],
          },
        ],
      },
      {
        id: "2",
        key: "skill_two",
        name: localizedString,
        category: localizedBehavioural,
        families: [
          {
            id: "1",
            key: "family_one",
            name: localizedString,
            description: localizedString,
            skills: [],
          },
        ],
      },
      {
        id: "3",
        key: "skill_three",
        name: localizedString,
        category: localizedBehavioural,
        families: [
          {
            id: "1",
            key: "family_one",
            name: localizedString,
            description: localizedString,
            skills: [],
          },
        ],
      },
    ];
    const expected = [
      {
        id: "1",
        key: "family_one",
        name: localizedString,
        description: localizedString,
        skills: [
          {
            id: "1",
            key: "skill_one",
            name: localizedString,
            category: localizedBehavioural,
            families: [],
          },
          {
            id: "2",
            key: "skill_two",
            name: localizedString,
            category: localizedBehavioural,
            families: [],
          },
          {
            id: "3",
            key: "skill_three",
            name: localizedString,
            category: localizedBehavioural,
            families: [],
          },
        ],
      },
    ];
    const actual = invertSkillSkillFamilyTree(skills);
    expect(actual).toEqual(expected);
  });
  test("inverts a skill tree with a single skill in three families", () => {
    const skills = [
      {
        id: "1",
        key: "skill_one",
        name: localizedString,
        category: localizedBehavioural,
        families: [
          {
            id: "1",
            key: "family_one",
            name: localizedString,
            description: localizedString,
            skills: [],
          },
          {
            id: "2",
            key: "family_two",
            name: localizedString,

            description: localizedString,
            skills: [],
          },
          {
            id: "3",
            key: "family_three",
            name: localizedString,

            description: localizedString,
            skills: [],
          },
        ],
      },
    ];
    const expected = [
      {
        id: "1",
        key: "family_one",
        name: localizedString,
        description: localizedString,
        skills: [
          {
            id: "1",
            key: "skill_one",
            category: localizedBehavioural,
            name: localizedString,
            families: [],
          },
        ],
      },
      {
        id: "2",
        key: "family_two",
        name: localizedString,
        description: localizedString,
        skills: [
          {
            id: "1",
            key: "skill_one",
            name: localizedString,
            category: localizedBehavioural,
            families: [],
          },
        ],
      },
      {
        id: "3",
        key: "family_three",
        name: localizedString,
        description: localizedString,
        skills: [
          {
            id: "1",
            key: "skill_one",
            name: localizedString,
            category: localizedBehavioural,
            families: [],
          },
        ],
      },
    ];
    const actual = invertSkillSkillFamilyTree(skills);
    expect(actual).toEqual(expected);
  });
  describe("parseKeywords", () => {
    test("returns null for falsy inputs", () => {
      expect(parseKeywords("")).toBeNull();
      expect(parseKeywords(null)).toBeNull();
      expect(parseKeywords(undefined)).toBeNull();
      expect(parseKeywords("  ")).toBeNull();
    });
    test("splits a nicely formatted list", () => {
      expect(parseKeywords("hello,world,nice,day")).toEqual([
        "hello",
        "world",
        "nice",
        "day",
      ]);
    });
    test("trims each list item", () => {
      expect(parseKeywords("hello  ,world,   nice,   day   ")).toEqual([
        "hello",
        "world",
        "nice",
        "day",
      ]);
    });
  });
});
