import { defineMessage } from "react-intl";

import jobPosterTemplateMessages from "~/messages/jobPosterTemplateMessages";

const sections = {
  basicDetails: {
    id: "basic-details",
    title: jobPosterTemplateMessages.basicDetails,
  },
  keyTasks: {
    id: "key-tasks",
    shortTitle: jobPosterTemplateMessages.keyTasks,
    longTitle: defineMessage({
      defaultMessage: "Key tasks - Examples",
      id: "/Bih8t",
      description:
        "Long title of the 'key tasks' section of the job poster template page",
    }),
  },
  essentialTechnicalSkills: {
    id: "essential-technical-skills",
    shortTitle: jobPosterTemplateMessages.essentialTechnicalSkills,
    longTitle: defineMessage({
      defaultMessage: "Essential technical skills - Examples",
      id: "6qXF7s",
      description:
        "Long title of the 'essential technical skills' section of the job poster template page",
    }),
  },
  essentialBehaviouralSkills: {
    id: "essential-behavioural-skills",
    shortTitle: jobPosterTemplateMessages.essentialBehaviouralSkills,
    longTitle: defineMessage({
      defaultMessage: "Essential behavioural skills - Examples",
      id: "KwJigi",
      description:
        "Long title of the 'essential behavioural skills' section of the job poster template page",
    }),
  },
  assetTechnicalSkills: {
    id: "asset-technical-skills",
    shortTitle: jobPosterTemplateMessages.assetTechnicalSkills,
    longTitle: defineMessage({
      defaultMessage: "Asset technical skills - Examples",
      id: "5zJ+/1",
      description:
        "Long title of the 'asset technical skills' section of the job poster template page",
    }),
  },
} as const;

export default sections;
