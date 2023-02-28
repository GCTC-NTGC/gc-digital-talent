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
    const actual = invertSkillSkillFamilyTree(skills);
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
    const actual = invertSkillSkillFamilyTree(skills);
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
    const actual = invertSkillSkillFamilyTree(skills);
    expect(actual).toEqual(expected);
  });
  test("inverts an experience tree with a single experience in a single skill", () => {
    const experiences: Experience[] = [
      {
        id: "1",
        applicant: fakeApplicant,
        skills: [
          {
            id: "1",
            key: "skill_one",
            name: {},
          },
        ],
      },
    ];
    const expected: Skill[] = [
      {
        id: "1",
        key: "skill_one",
        name: {},
        experiences: [
          {
            id: "1",
            applicant: fakeApplicant,
            skills: [
              {
                id: "1",
                key: "skill_one",
                name: {},
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
        applicant: fakeApplicant,
        skills: [
          {
            id: "1",
            key: "skill_one",
            name: {},
          },
        ],
      },
      {
        id: "2",
        applicant: fakeApplicant,
        skills: [
          {
            id: "1",
            key: "skill_one",
            name: {},
          },
        ],
      },
      {
        id: "3",
        applicant: fakeApplicant,
        skills: [
          {
            id: "1",
            key: "skill_one",
            name: {},
          },
        ],
      },
    ];
    const expected: Skill[] = [
      {
        id: "1",
        key: "skill_one",
        name: {},
        experiences: [
          {
            id: "1",
            applicant: fakeApplicant,
            skills: [
              {
                id: "1",
                key: "skill_one",
                name: {},
              },
            ],
          },
          {
            id: "2",
            applicant: fakeApplicant,
            skills: [
              {
                id: "1",
                key: "skill_one",
                name: {},
              },
            ],
          },
          {
            id: "3",
            applicant: fakeApplicant,
            skills: [
              {
                id: "1",
                key: "skill_one",
                name: {},
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
        applicant: fakeApplicant,
        skills: [
          {
            id: "1",
            key: "skill_one",
            name: {},
          },
          {
            id: "2",
            key: "skill_two",
            name: {},
          },
          {
            id: "3",
            key: "skill_three",
            name: {},
          },
        ],
      },
    ];
    const expected: Skill[] = [
      {
        id: "1",
        key: "skill_one",
        name: {},
        experiences: [
          {
            id: "1",
            applicant: fakeApplicant,
            skills: [
              {
                id: "1",
                key: "skill_one",
                name: {},
              },
              {
                id: "2",
                key: "skill_two",
                name: {},
              },
              {
                id: "3",
                key: "skill_three",
                name: {},
              },
            ],
          },
        ],
      },
      {
        id: "2",
        key: "skill_two",
        name: {},
        experiences: [
          {
            id: "1",
            applicant: fakeApplicant,
            skills: [
              {
                id: "1",
                key: "skill_one",
                name: {},
              },
              {
                id: "2",
                key: "skill_two",
                name: {},
              },
              {
                id: "3",
                key: "skill_three",
                name: {},
              },
            ],
          },
        ],
      },
      {
        id: "3",
        key: "skill_three",
        name: {},
        experiences: [
          {
            id: "1",
            applicant: fakeApplicant,
            skills: [
              {
                id: "1",
                key: "skill_one",
                name: {},
              },
              {
                id: "2",
                key: "skill_two",
                name: {},
              },
              {
                id: "3",
                key: "skill_three",
                name: {},
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
