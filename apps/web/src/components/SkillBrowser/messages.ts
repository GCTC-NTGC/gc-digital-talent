import { defineMessages } from "react-intl";

const skillBrowserMessages = defineMessages({
  skillFamilyPlaceholder: {
    defaultMessage: "Select a skill family",
    id: "pCZ1wt",
    description: "Placeholder message when there is no skill family selected",
  },
  skillCategoryPlaceholder: {
    defaultMessage: "Select a category",
    id: "OlZeZO",
    description: "Placeholder message when there is no skill category selected",
  },
  skillCategory: {
    defaultMessage: "Skill category",
    id: "piZjS+",
    description: "Label for the skill category filter field",
  },
  skillFamily: {
    defaultMessage: "Filter by skill family",
    id: "K91fwT",
    description: "Label for the skill family filter field",
  },
  skill: {
    defaultMessage: "Skill",
    id: "+K/smr",
    description: "Label for the skill select field",
  },
  nullSkill: {
    id: "HrRgTT",
    defaultMessage: "Please select a skill to continue.",
    description: "Help text to tell users to select a skill before submitting",
  },
  nullSkillFamily: {
    defaultMessage: "Select a skill family and skill to continue.",
    id: "jYPyWq",
    description:
      "Error message when a user attempts to add a skill before selecting one",
  },
  hideSkillInfo: {
    defaultMessage: "Hide information on what to do if you can't find a skill",
    id: "AxRGK2",
    description: "Button text to hide help information about skills",
  },
  showSkillInfo: {
    defaultMessage: "Find out what to do if you can't find a skill",
    id: "mAN6yW",
    description: "Button text to show help information about skills",
  },
});

export default skillBrowserMessages;
