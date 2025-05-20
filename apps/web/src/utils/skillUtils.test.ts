/**
 * @jest-environment jsdom
 */

import { toLocalizedEnum } from "@gc-digital-talent/fake-data";
import {
  Experience,
  Skill,
  SkillCategory,
  SkillFamily,
} from "@gc-digital-talent/graphql";

import {
  invertSkillExperienceTree,
  invertSkillSkillFamilyTree,
  parseKeywords,
} from "./skillUtils";

const localizedBehavioural = toLocalizedEnum(SkillCategory.Behavioural);

describe("skill util tests", () => {
  test("inverts a skill tree with a single skill in a single family", () => {
    const skills: Skill[] = [
      {
        id: "1",
        key: "skill_one",
        name: {},
        category: localizedBehavioural,
        families: [
          {
            id: "1",
            key: "family_one",
            name: {},
            description: {},
            skills: [],
          },
        ],
      },
    ];
    const expected: SkillFamily[] = [
      {
        id: "1",
        key: "family_one",
        name: {},
        description: {},
        skills: [
          {
            id: "1",
            key: "skill_one",
            name: {},
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
    const skills: Skill[] = [
      {
        id: "1",
        key: "skill_one",
        name: {},
        category: localizedBehavioural,
        families: [
          {
            id: "1",
            key: "family_one",
            name: {},
            description: {},
            skills: [],
          },
        ],
      },
      {
        id: "2",
        key: "skill_two",
        name: {},
        category: localizedBehavioural,
        families: [
          {
            id: "1",
            key: "family_one",
            name: {},
            description: {},
            skills: [],
          },
        ],
      },
      {
        id: "3",
        key: "skill_three",
        name: {},
        category: localizedBehavioural,
        families: [
          {
            id: "1",
            key: "family_one",
            name: {},
            description: {},
            skills: [],
          },
        ],
      },
    ];
    const expected: SkillFamily[] = [
      {
        id: "1",
        key: "family_one",
        name: {},
        description: {},
        skills: [
          {
            id: "1",
            key: "skill_one",
            name: {},
            category: localizedBehavioural,
            families: [],
          },
          {
            id: "2",
            key: "skill_two",
            name: {},
            category: localizedBehavioural,
            families: [],
          },
          {
            id: "3",
            key: "skill_three",
            name: {},
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
    const skills: Skill[] = [
      {
        id: "1",
        key: "skill_one",
        name: {},
        category: localizedBehavioural,
        families: [
          {
            id: "1",
            key: "family_one",
            name: {},
            description: {},
            skills: [],
          },
          {
            id: "2",
            key: "family_two",
            name: {},

            description: {},
            skills: [],
          },
          {
            id: "3",
            key: "family_three",
            name: {},

            description: {},
            skills: [],
          },
        ],
      },
    ];
    const expected: SkillFamily[] = [
      {
        id: "1",
        key: "family_one",
        name: {},
        description: {},
        skills: [
          {
            id: "1",
            key: "skill_one",
            category: localizedBehavioural,
            name: {},
            families: [],
          },
        ],
      },
      {
        id: "2",
        key: "family_two",
        name: {},
        description: {},
        skills: [
          {
            id: "1",
            key: "skill_one",
            name: {},
            category: localizedBehavioural,
            families: [],
          },
        ],
      },
      {
        id: "3",
        key: "family_three",
        name: {},
        description: {},
        skills: [
          {
            id: "1",
            key: "skill_one",
            name: {},
            category: localizedBehavioural,
            families: [],
          },
        ],
      },
    ];
    const actual = invertSkillSkillFamilyTree(skills);
    expect(actual).toEqual(expected);
  });
  test("inverts an experience tree with a single experience in a single skill", () => {
    const experiences: Omit<Experience, "user">[] = [
      {
        id: "1",
        skills: [
          {
            id: "1",
            key: "skill_one",
            name: {},
            category: localizedBehavioural,
          },
        ],
      },
    ];
    const expected = [
      {
        id: "1",
        key: "skill_one",
        name: {},
        category: localizedBehavioural,
        experiences: [
          {
            id: "1",
            skills: [
              {
                id: "1",
                key: "skill_one",
                name: {},
                category: localizedBehavioural,
              },
            ],
          },
        ],
      },
    ];
    const actual = invertSkillExperienceTree(experiences);
    expect(actual).toEqual(expected);
  });
  test("inverts an experience tree with three experiences in a single skill", () => {
    const experiences: Omit<Experience, "user">[] = [
      {
        id: "1",
        skills: [
          {
            id: "1",
            key: "skill_one",
            name: {},
            category: localizedBehavioural,
          },
        ],
      },
      {
        id: "2",
        skills: [
          {
            id: "1",
            key: "skill_one",
            name: {},
            category: localizedBehavioural,
          },
        ],
      },
      {
        id: "3",
        skills: [
          {
            id: "1",
            key: "skill_one",
            name: {},
            category: localizedBehavioural,
          },
        ],
      },
    ];
    const expected = [
      {
        id: "1",
        key: "skill_one",
        name: {},
        category: localizedBehavioural,
        experiences: [
          {
            id: "1",
            skills: [
              {
                id: "1",
                key: "skill_one",
                name: {},
                category: localizedBehavioural,
              },
            ],
          },
          {
            id: "2",
            skills: [
              {
                id: "1",
                key: "skill_one",
                name: {},
                category: localizedBehavioural,
              },
            ],
          },
          {
            id: "3",
            skills: [
              {
                id: "1",
                key: "skill_one",
                name: {},
                category: localizedBehavioural,
              },
            ],
          },
        ],
      },
    ];
    const actual = invertSkillExperienceTree(experiences);
    expect(actual).toEqual(expected);
  });
  test("inverts an experience tree with a single experience in three skills", () => {
    const experiences: Omit<Experience, "user">[] = [
      {
        id: "1",
        skills: [
          {
            id: "1",
            key: "skill_one",
            name: {},
            category: localizedBehavioural,
          },
          {
            id: "2",
            key: "skill_two",
            name: {},
            category: localizedBehavioural,
          },
          {
            id: "3",
            key: "skill_three",
            name: {},
            category: localizedBehavioural,
          },
        ],
      },
    ];
    const expected = [
      {
        id: "1",
        key: "skill_one",
        name: {},
        category: localizedBehavioural,
        experiences: [
          {
            id: "1",
            skills: [
              {
                id: "1",
                key: "skill_one",
                name: {},
                category: localizedBehavioural,
              },
              {
                id: "2",
                key: "skill_two",
                name: {},
                category: localizedBehavioural,
              },
              {
                id: "3",
                key: "skill_three",
                name: {},
                category: localizedBehavioural,
              },
            ],
          },
        ],
      },
      {
        id: "2",
        key: "skill_two",
        name: {},
        category: localizedBehavioural,
        experiences: [
          {
            id: "1",
            skills: [
              {
                id: "1",
                key: "skill_one",
                name: {},
                category: localizedBehavioural,
              },
              {
                id: "2",
                key: "skill_two",
                name: {},
                category: localizedBehavioural,
              },
              {
                id: "3",
                key: "skill_three",
                name: {},
                category: localizedBehavioural,
              },
            ],
          },
        ],
      },
      {
        id: "3",
        key: "skill_three",
        name: {},
        category: localizedBehavioural,
        experiences: [
          {
            id: "1",
            skills: [
              {
                id: "1",
                key: "skill_one",
                name: {},
                category: localizedBehavioural,
              },
              {
                id: "2",
                key: "skill_two",
                name: {},
                category: localizedBehavioural,
              },
              {
                id: "3",
                key: "skill_three",
                name: {},
                category: localizedBehavioural,
              },
            ],
          },
        ],
      },
    ];
    const actual = invertSkillExperienceTree(experiences);
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
