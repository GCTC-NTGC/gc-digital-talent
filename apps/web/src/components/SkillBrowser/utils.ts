import { IntlShape } from "react-intl";

import { Option } from "@gc-digital-talent/forms";
import { Skill, SkillCategory, SkillFamily } from "@gc-digital-talent/graphql";

import { invertSkillSkillFamilyTree } from "~/utils/skillUtils";

import { FormValues, SkillBrowserDialogContext } from "./types";

export const INPUT_NAME = {
  CATEGORY: "skill-browser-category",
  FAMILY: "skill-browser-family",
};

export const defaultFormValues: FormValues = {
  category: "",
  family: "",
  skill: "",
};

interface SkillBrowserDialogMessages {
  trigger: React.ReactNode;
  title: React.ReactNode;
  subtitle: React.ReactNode;
  submit: React.ReactNode;
  selected: (skillName: string) => React.ReactNode;
}

type GetSkillBrowserDialogMessagesArgs = {
  context?: SkillBrowserDialogContext;
  intl: IntlShape;
};

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
        defaultMessage: "Add a new skill",
        id: "ZYqWBR",
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
        defaultMessage: "Add a new skill",
        id: "4Jc5pN",
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

  if (context === "directive_forms") {
    return {
      ...defaults,
      trigger: intl.formatMessage({
        defaultMessage: "Add a skill",
        id: "hBf/ab",
        description:
          "Button text to open the skill dialog and add a skill to the users library",
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
  const detailContexts: SkillBrowserDialogContext[] = [
    "library",
    "showcase",
    "directive_forms",
  ];

  // We do not need details if already in library when on showcase context
  if (context === "showcase" && skillInLibrary) {
    return false;
  }

  return context ? detailContexts.includes(context) : false;
};

type GetFilteredFamiliesArgs = {
  skills: Skill[];
  category: SkillCategory | "all" | "";
};

type GetFilteredFamilies = (args: GetFilteredFamiliesArgs) => SkillFamily[];

export const getFilteredFamilies: GetFilteredFamilies = ({
  skills,
  category,
}) => {
  const invertedTree = invertSkillSkillFamilyTree(skills);

  return category && category !== "all"
    ? invertedTree.filter((currentFamily) => {
        return currentFamily.skills?.filter((s) => s.category === category);
      })
    : invertedTree;
};

type GetFilteredSkillsArgs = {
  skills: Skill[];
  family: SkillFamily | "all" | "library" | "";
  category?: SkillCategory | "all" | "";
  inLibrary?: Skill[];
};

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
    return skills.filter((currentSkill) => currentSkill.category === category);
  }

  // neither is set so return all skills
  return skills;
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
  category: SkillCategory | "all",
): number => {
  const skillsByCategory = skills.filter(
    (skill) => skill.category === category,
  );
  return skillsByCategory.length;
};

export const getCategoryOptions = (
  skills: Skill[],
  intl: IntlShape,
): Option[] => {
  return [
    {
      value: "all",
      label: intl.formatMessage(
        {
          defaultMessage: "All categories ({count} skills)",
          id: "OqKTJQ",
          description: "Label for removing the skill category filter",
        },
        {
          count: skills.length,
        },
      ),
    },
    {
      value: SkillCategory.Behavioural,
      label: intl.formatMessage(
        {
          defaultMessage: "Behavioural skills ({count} skills)",
          id: "+ayqFd",
          description: "Tab name for a list of behavioural skills",
        },
        {
          count: getSkillCategorySkillCount(skills, SkillCategory.Behavioural),
        },
      ),
    },
    {
      value: SkillCategory.Technical,
      label: intl.formatMessage(
        {
          defaultMessage: "Technical skills ({count} skills)",
          id: "4LQLyh",
          description: "Tab name for a list of technical skills",
        },
        {
          count: getSkillCategorySkillCount(skills, SkillCategory.Technical),
        },
      ),
    },
  ];
};

export const getFamilyOptions = (
  skills: Skill[],
  intl: IntlShape,
  category?: SkillCategory | "all",
  inLibrary?: Skill[],
): Option[] => {
  const filteredSkills =
    category !== "all"
      ? skills.filter((skill) => skill.category === category)
      : skills;
  const filteredLibrary = inLibrary?.filter((librarySkill) =>
    skills.some((skill) => skill.id === librarySkill.id),
  );

  let familyOptions = [
    {
      value: "all",
      label: intl.formatMessage(
        {
          defaultMessage: "All skills ({count} skills)",
          id: "Id9nfM",
          description: "Label for removing the skill family filter",
        },
        {
          count:
            category && category !== "all"
              ? filteredSkills.length
              : skills.length,
        },
      ),
    },
  ];

  if (filteredLibrary) {
    familyOptions = [
      ...familyOptions,
      {
        value: "library",
        label: intl.formatMessage(
          {
            defaultMessage: "My library ({count} skills)",
            id: "hzZc5Y",
            description:
              "Label for filtering skills by ones already added to the users library",
          },
          {
            count: filteredLibrary.length,
          },
        ),
      },
    ];
  }

  return familyOptions;
};

export const formatOption = (label: string, count: number, intl: IntlShape) =>
  intl.formatMessage(
    {
      defaultMessage: "{label} ({count} skills)",
      id: "MmDHBS",
      description:
        "Label for options when selecting skill filters where {count} is the number of skills associated with the filter",
    },
    { label, count },
  );
