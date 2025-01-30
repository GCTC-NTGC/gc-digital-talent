import { IntlShape } from "react-intl";
import { ReactNode } from "react";

import { Option } from "@gc-digital-talent/forms";
import { Skill, SkillCategory, SkillFamily } from "@gc-digital-talent/graphql";

import { invertSkillSkillFamilyTree } from "~/utils/skillUtils";

import { FormValues, SkillBrowserDialogContext } from "./types";

export const INPUT_NAME = {
  CATEGORY: "skill-browser-category",
  FAMILY: "skill-browser-family",
};

export const defaultFormValues: FormValues = {
  family: "all",
  skill: "",
};

interface SkillBrowserDialogMessages {
  trigger: ReactNode;
  title: ReactNode;
  subtitle: ReactNode;
  submit: ReactNode;
  selected: (skillName: string) => ReactNode;
}

interface GetSkillBrowserDialogMessagesArgs {
  context?: SkillBrowserDialogContext;
  intl: IntlShape;
}

type GetSkillBrowserDialogMessages = (
  args: GetSkillBrowserDialogMessagesArgs,
) => SkillBrowserDialogMessages;

// eslint-disable-next-line import/prefer-default-export
export const getSkillBrowserDialogMessages: GetSkillBrowserDialogMessages = ({
  context,
  intl,
}) => {
  const defaults: SkillBrowserDialogMessages = {
    trigger: intl.formatMessage({
      defaultMessage: "Find a skill",
      id: "maibxu",
      description: "Button text to open the skill dialog",
    }),
    title: intl.formatMessage({
      defaultMessage: "Find a skill",
      id: "mLmPpf",
      description: "Title for the find a skill dialog",
    }),
    subtitle: intl.formatMessage({
      defaultMessage:
        "Find a skill from our library using filters and keyword search.",
      id: "0Q89Cz",
      description: "Subtitle for the find a skill dialog",
    }),
    submit: intl.formatMessage({
      defaultMessage: "Add this skill",
      id: "xkJAuq",
      description: "Button text to select a specific skill in the skill dialog",
    }),
    selected: (skill: string) =>
      intl.formatMessage(
        {
          defaultMessage: "{skill} selected.",
          id: "Yc2A2Q",
          description: "Message displayed when a skill was selected",
        },
        {
          skill,
        },
      ),
  };

  if (context === "pool") {
    return {
      ...defaults,
      trigger: intl.formatMessage({
        defaultMessage: "Add skill",
        id: "RSUgO3",
        description: "Button text to open the skill dialog and add a skill",
      }),
      title: intl.formatMessage({
        defaultMessage: "Manage a skill criteria",
        id: "Pi5icf",
        description: "Title for the find a skill dialog within a pool",
      }),
      subtitle: intl.formatMessage({
        defaultMessage:
          "Select from a variety of skills and identify the level required of applicants.",
        id: "md/sEi",
        description: "Subtitle for the find a skill dialog within a pool",
      }),
    };
  }

  if (context === "experience") {
    return {
      ...defaults,
      trigger: intl.formatMessage({
        defaultMessage: "Add a skill",
        id: "mS15HC",
        description: "Button text to open the skill dialog and add a skill",
      }),
      title: intl.formatMessage({
        defaultMessage:
          "Find and link a skill to your career timeline experience",
        id: "Q+7LUo",
        description: "Title for the find a skill dialog within an experience",
      }),
      subtitle: intl.formatMessage({
        defaultMessage:
          "This skill will also be added to your skills portfolio if it's not already there.",
        id: "Z5Cv3U",
        description:
          "Subtitle for the find a skill dialog within an experience",
      }),
    };
  }

  if (context === "library") {
    return {
      ...defaults,
      trigger: intl.formatMessage({
        defaultMessage: "Add a new skill",
        id: "4Jc5pN",
        description:
          "Button text to open the skill dialog and add a skill to the users library",
      }),
      title: intl.formatMessage({
        defaultMessage: "Find and add a new skill to your portfolio",
        id: "ZoZNDf",
        description:
          "Title for the find a skill dialog within the skill portfolio",
      }),
      subtitle: intl.formatMessage({
        defaultMessage:
          "Search through our database of skills and link one to your profile.",
        id: "5WEzE3",
        description:
          "Subtitle for the find a skill dialog within the skill portfolio",
      }),
      submit: intl.formatMessage({
        defaultMessage: "Save and add this skill",
        id: "4nP41q",
        description: "Button text to save a specific skill to a users profile",
      }),
    };
  }

  if (context === "showcase") {
    return {
      ...defaults,
      trigger: intl.formatMessage({
        defaultMessage: "Add a new item",
        id: "KdbrIC",
        description:
          "Button text to open the skill dialog and add a skill to the users library",
      }),
      title: intl.formatMessage({
        defaultMessage: "Find and add a skill to your portfolio",
        id: "+gnEgg",
        description:
          "Title for the find a skill dialog within the skill portfolio",
      }),
      subtitle: intl.formatMessage({
        defaultMessage:
          "Select from skills in your library or add brand new ones.",
        id: "znuDvD",
        description:
          "Subtitle for the find a skill dialog within the skill showcase",
      }),
      submit: intl.formatMessage({
        defaultMessage: "Save and add this skill",
        id: "4nP41q",
        description: "Button text to save a specific skill to a users profile",
      }),
    };
  }

  return defaults;
};

export const showDetails = (
  skillInLibrary: boolean,
  context: SkillBrowserDialogContext | undefined,
): boolean => {
  const detailContexts: SkillBrowserDialogContext[] = ["library", "showcase"];

  // We do not need details if already in library when on showcase context
  if (context === "showcase" && skillInLibrary) {
    return false;
  }

  return context ? detailContexts.includes(context) : false;
};

interface GetFilteredFamiliesArgs {
  skills: Skill[];
}

type GetFilteredFamilies = (args: GetFilteredFamiliesArgs) => SkillFamily[];

export const getFilteredFamilies: GetFilteredFamilies = ({ skills }) => {
  const invertedTree = invertSkillSkillFamilyTree(skills);

  return invertedTree;
};

interface GetFilteredSkillsArgs {
  skills: Skill[];
  family?: string;
  category?: SkillCategory | "all" | "";
  inLibrary?: Skill[];
}

type GetFilteredSkills = (args: GetFilteredSkillsArgs) => Skill[];

export const getFilteredSkills: GetFilteredSkills = ({
  skills,
  family,
  category,
  inLibrary,
}) => {
  if (inLibrary && family && family === "library") {
    // If `inLibrary` was passed and selected, filter by those instead of family
    return skills.filter((currentSkill) =>
      inLibrary?.find(
        (skillInLibrary) => skillInLibrary.id === currentSkill.id,
      ),
    );
  }

  if (family && family !== "all") {
    // We only care about family if it is set
    // since we are filtering families by category
    return skills.filter((currentSkill) =>
      currentSkill.families?.some((skillFamily) => skillFamily.id === family),
    );
  }
  if (category && category !== "all") {
    return skills.filter(
      (currentSkill) => currentSkill.category.value === category,
    );
  }

  // neither is set so return all skills
  return skills;
};

export const getFamilyOptions = (
  skills: Skill[],
  intl: IntlShape,
  inLibrary?: Skill[],
): Option[] => {
  const filteredLibrary = inLibrary?.filter((librarySkill) =>
    skills.some((skill) => skill.id === librarySkill.id),
  );

  let familyOptions = [
    {
      value: "all",
      label: intl.formatMessage({
        defaultMessage: "All skills",
        id: "EIM5Jw",
        description: "Label for removing the skill family filter",
      }),
    },
  ];

  if (filteredLibrary) {
    familyOptions = [
      ...familyOptions,
      {
        value: "library",
        label: intl.formatMessage({
          defaultMessage: "My library",
          id: "Kki7mk",
          description:
            "Label for filtering skills by ones already added to the users library",
        }),
      },
    ];
  }

  return familyOptions;
};
