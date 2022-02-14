/**
 * @jest-environment jsdom
 */

import { invertSkillTree } from "./skillUtils";
import { Skill, SkillCategory, SkillFamily } from "../api/generated";

describe("skill util tests", () => {
  test("inverts a skill tree with a single skill in a single family", () => {
    const skills: Skill[] = [
      {
        id: "1",
        key: "skill_one",
        name: {},
        families: [
          {
            id: "1",
            key: "family_one",
            name: {},
            category: SkillCategory.Behavioural,
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
        category: SkillCategory.Behavioural,
        description: {},
        skills: [
          {
            id: "1",
            key: "skill_one",
            name: {},
            families: [],
          },
        ],
      },
    ];
    const actual = invertSkillTree(skills);
    expect(actual).toEqual(expected);
  });
  test("inverts a skill tree with three skills in a single family", () => {
    const skills: Skill[] = [
      {
        id: "1",
        key: "skill_one",
        name: {},
        families: [
          {
            id: "1",
            key: "family_one",
            name: {},
            category: SkillCategory.Behavioural,
            description: {},
            skills: [],
          },
        ],
      },
      {
        id: "2",
        key: "skill_two",
        name: {},
        families: [
          {
            id: "1",
            key: "family_one",
            name: {},
            category: SkillCategory.Behavioural,
            description: {},
            skills: [],
          },
        ],
      },
      {
        id: "3",
        key: "skill_three",
        name: {},
        families: [
          {
            id: "1",
            key: "family_one",
            name: {},
            category: SkillCategory.Behavioural,
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
        category: SkillCategory.Behavioural,
        description: {},
        skills: [
          {
            id: "1",
            key: "skill_one",
            name: {},
            families: [],
          },
          {
            id: "2",
            key: "skill_two",
            name: {},
            families: [],
          },
          {
            id: "3",
            key: "skill_three",
            name: {},
            families: [],
          },
        ],
      },
    ];
    const actual = invertSkillTree(skills);
    expect(actual).toEqual(expected);
  });
  test("inverts a skill tree with a single skill in three families", () => {
    const skills: Skill[] = [
      {
        id: "1",
        key: "skill_one",
        name: {},
        families: [
          {
            id: "1",
            key: "family_one",
            name: {},
            category: SkillCategory.Behavioural,
            description: {},
            skills: [],
          },
          {
            id: "2",
            key: "family_two",
            name: {},
            category: SkillCategory.Behavioural,
            description: {},
            skills: [],
          },
          {
            id: "3",
            key: "family_three",
            name: {},
            category: SkillCategory.Behavioural,
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
        category: SkillCategory.Behavioural,
        description: {},
        skills: [
          {
            id: "1",
            key: "skill_one",
            name: {},
            families: [],
          },
        ],
      },
      {
        id: "2",
        key: "family_two",
        name: {},
        category: SkillCategory.Behavioural,
        description: {},
        skills: [
          {
            id: "1",
            key: "skill_one",
            name: {},
            families: [],
          },
        ],
      },
      {
        id: "3",
        key: "family_three",
        name: {},
        category: SkillCategory.Behavioural,
        description: {},
        skills: [
          {
            id: "1",
            key: "skill_one",
            name: {},
            families: [],
          },
        ],
      },
    ];
    const actual = invertSkillTree(skills);
    expect(actual).toEqual(expected);
  });
});
