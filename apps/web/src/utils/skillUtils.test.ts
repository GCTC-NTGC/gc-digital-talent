/**
 * @jest-environment jsdom
 */

import { fakeApplicants } from "@gc-digital-talent/fake-data";

import { Experience, Skill, SkillCategory, SkillFamily } from "~/api/generated";

import {
  invertSkillExperienceTree,
  invertSkillSkillFamilyTree,
} from "./skillUtils";

const fakeApplicant = fakeApplicants(1)[0];

describe("skill util tests", () => {
  test("inverts a skill tree with a single skill in a single family", () => {
    const skills: Skill[] = [
      {
        id: "1",
        key: "skill_one",
        name: {},
        category: SkillCategory.Behavioural,
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
            category: SkillCategory.Behavioural,
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
        category: SkillCategory.Behavioural,
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
        category: SkillCategory.Behavioural,
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
        category: SkillCategory.Behavioural,
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
            category: SkillCategory.Behavioural,
            families: [],
          },
          {
            id: "2",
            key: "skill_two",
            name: {},
            category: SkillCategory.Behavioural,
            families: [],
          },
          {
            id: "3",
            key: "skill_three",
            name: {},
            category: SkillCategory.Behavioural,
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
        category: SkillCategory.Behavioural,
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
            category: SkillCategory.Behavioural,
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
            category: SkillCategory.Behavioural,
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
            category: SkillCategory.Behavioural,
            families: [],
          },
        ],
      },
    ];
    const actual = invertSkillSkillFamilyTree(skills);
    expect(actual).toEqual(expected);
  });
  test("inverts an experience tree with a single experience in a single skill", () => {
    const experiences: Experience[] = [
      {
        id: "1",
        user: fakeApplicant,
        skills: [
          {
            id: "1",
            key: "skill_one",
            name: {},
            category: SkillCategory.Behavioural,
          },
        ],
      },
    ];
    const expected: Skill[] = [
      {
        id: "1",
        key: "skill_one",
        name: {},
        category: SkillCategory.Behavioural,
        experiences: [
          {
            id: "1",
            user: fakeApplicant,
            skills: [
              {
                id: "1",
                key: "skill_one",
                name: {},
                category: SkillCategory.Behavioural,
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
    const experiences: Experience[] = [
      {
        id: "1",
        user: fakeApplicant,
        skills: [
          {
            id: "1",
            key: "skill_one",
            name: {},
            category: SkillCategory.Behavioural,
          },
        ],
      },
      {
        id: "2",
        user: fakeApplicant,
        skills: [
          {
            id: "1",
            key: "skill_one",
            name: {},
            category: SkillCategory.Behavioural,
          },
        ],
      },
      {
        id: "3",
        user: fakeApplicant,
        skills: [
          {
            id: "1",
            key: "skill_one",
            name: {},
            category: SkillCategory.Behavioural,
          },
        ],
      },
    ];
    const expected: Skill[] = [
      {
        id: "1",
        key: "skill_one",
        name: {},
        category: SkillCategory.Behavioural,
        experiences: [
          {
            id: "1",
            user: fakeApplicant,
            skills: [
              {
                id: "1",
                key: "skill_one",
                name: {},
                category: SkillCategory.Behavioural,
              },
            ],
          },
          {
            id: "2",
            user: fakeApplicant,
            skills: [
              {
                id: "1",
                key: "skill_one",
                name: {},
                category: SkillCategory.Behavioural,
              },
            ],
          },
          {
            id: "3",
            user: fakeApplicant,
            skills: [
              {
                id: "1",
                key: "skill_one",
                name: {},
                category: SkillCategory.Behavioural,
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
    const experiences: Experience[] = [
      {
        id: "1",
        user: fakeApplicant,
        skills: [
          {
            id: "1",
            key: "skill_one",
            name: {},
            category: SkillCategory.Behavioural,
          },
          {
            id: "2",
            key: "skill_two",
            name: {},
            category: SkillCategory.Behavioural,
          },
          {
            id: "3",
            key: "skill_three",
            name: {},
            category: SkillCategory.Behavioural,
          },
        ],
      },
    ];
    const expected: Skill[] = [
      {
        id: "1",
        key: "skill_one",
        name: {},
        category: SkillCategory.Behavioural,
        experiences: [
          {
            id: "1",
            user: fakeApplicant,
            skills: [
              {
                id: "1",
                key: "skill_one",
                name: {},
                category: SkillCategory.Behavioural,
              },
              {
                id: "2",
                key: "skill_two",
                name: {},
                category: SkillCategory.Behavioural,
              },
              {
                id: "3",
                key: "skill_three",
                name: {},
                category: SkillCategory.Behavioural,
              },
            ],
          },
        ],
      },
      {
        id: "2",
        key: "skill_two",
        name: {},
        category: SkillCategory.Behavioural,
        experiences: [
          {
            id: "1",
            user: fakeApplicant,
            skills: [
              {
                id: "1",
                key: "skill_one",
                name: {},
                category: SkillCategory.Behavioural,
              },
              {
                id: "2",
                key: "skill_two",
                name: {},
                category: SkillCategory.Behavioural,
              },
              {
                id: "3",
                key: "skill_three",
                name: {},
                category: SkillCategory.Behavioural,
              },
            ],
          },
        ],
      },
      {
        id: "3",
        key: "skill_three",
        name: {},
        category: SkillCategory.Behavioural,
        experiences: [
          {
            id: "1",
            user: fakeApplicant,
            skills: [
              {
                id: "1",
                key: "skill_one",
                name: {},
                category: SkillCategory.Behavioural,
              },
              {
                id: "2",
                key: "skill_two",
                name: {},
                category: SkillCategory.Behavioural,
              },
              {
                id: "3",
                key: "skill_three",
                name: {},
                category: SkillCategory.Behavioural,
              },
            ],
          },
        ],
      },
    ];
    const actual = invertSkillExperienceTree(experiences);
    expect(actual).toEqual(expected);
  });
});
