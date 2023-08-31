import { IntlShape } from "react-intl";
import React from "react";

import { Skill, SkillCategory, SkillFamily } from "@gc-digital-talent/graphql";

import { SkillDialogContext } from "./types";

interface SkillDialogMessages {
  trigger: React.ReactNode;
  title: React.ReactNode;
  subtitle: React.ReactNode;
  submit: React.ReactNode;
  selected: (skillName: string) => React.ReactNode;
}

type GetSkillDialogMessagesArgs = {
  context?: SkillDialogContext;
  intl: IntlShape;
};

type GetSkillDialogMessages = (
  args: GetSkillDialogMessagesArgs,
) => SkillDialogMessages;

// eslint-disable-next-line import/prefer-default-export
export const getSkillDialogMessages: GetSkillDialogMessages = ({
  context,
  intl,
}) => {
  const defaults: SkillDialogMessages = {
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
          "The skill you choose will also be added to your skills showcase if it's not already there.",
        id: "Y96JXz",
        description:
          "Subtitle for the find a skill dialog within an experience",
      }),
    };
  }

  if (context === "library") {
    return {
      ...defaults,
      trigger: intl.formatMessage({
        defaultMessage: "Add a new item",
        id: "KdbrIC",
        description:
          "Button text to open the skill dialog and add a skill to the users library",
      }),
      title: intl.formatMessage({
        defaultMessage: "Find and add a new skill to your library",
        id: "iMtZOR",
        description:
          "Title for the find a skill dialog within the skill library",
      }),
      subtitle: intl.formatMessage({
        defaultMessage:
          "Search through our database of skills and link on to your profile.",
        id: "XpiMeF",
        description:
          "Subtitle for the find a skill dialog within the skill library",
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
        defaultMessage: "Find and add a skill to your showcase",
        id: "Q9c+Kg",
        description:
          "Title for the find a skill dialog within the skill showcase",
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
  context: SkillDialogContext | undefined,
): boolean => {
  const detailContexts: SkillDialogContext[] = ["library", "showcase"];

  return context ? detailContexts.includes(context) : false;
};

export const getSkillFamilySkillCount = (
  skills: Skill[],
  family: SkillFamily,
): number => {
  const skillsByFamily = skills.filter((skill) => {
    return skill.families?.some((skillFamily) => skillFamily.id === family.id);
  });

  return skillsByFamily.length;
};

export const getSkillCategorySkillCount = (
  skills: Skill[],
  category: SkillCategory,
): number => {
  const skillsByCategory = skills.filter(
    (skill) => skill.category === category,
  );
  return skillsByCategory.length;
};
