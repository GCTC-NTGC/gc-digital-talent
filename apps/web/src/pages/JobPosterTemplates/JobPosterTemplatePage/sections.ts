import { defineMessage } from "react-intl";

const sections = {
  basicDetails: {
    id: "basic-details",
    title: defineMessage({
      defaultMessage: "Basic details",
      id: "tcL+WV",
      description:
        "Title of the 'basic details' section of the job poster template page",
    }),
  },
  keyTasks: {
    id: "key-tasks",
    shortTitle: defineMessage({
      defaultMessage: "Key tasks",
      id: "hkVnr1",
      description:
        "Short title of the 'key tasks' section of the job poster template page",
    }),
    longTitle: defineMessage({
      defaultMessage: "Key tasks - Examples",
      id: "/Bih8t",
      description:
        "Long title of the 'key tasks' section of the job poster template page",
    }),
  },
  essentialTechnicalSkills: {
    id: "essential-technical-skills",
    shortTitle: defineMessage({
      defaultMessage: "Essential technical skills",
      id: "fpm0Bt",
      description:
        "Short title of the 'essential technical skills' section of the job poster template page",
    }),
    longTitle: defineMessage({
      defaultMessage: "Essential technical skills - Examples",
      id: "6qXF7s",
      description:
        "Long title of the 'essential technical skills' section of the job poster template page",
    }),
  },
  essentialBehaviouralSkills: {
    id: "essential-behavioural-skills",
    shortTitle: defineMessage({
      defaultMessage: "Essential behavioural skills",
      id: "4wIDU6",
      description:
        "Short title of the 'essential behavioural skills' section of the job poster template page",
    }),
    longTitle: defineMessage({
      defaultMessage: "Essential behavioural skills - Examples",
      id: "KwJigi",
      description:
        "Long title of the 'essential behavioural skills' section of the job poster template page",
    }),
  },
  assetTechnicalSkills: {
    id: "asset-technical-skills",
    shortTitle: defineMessage({
      defaultMessage: "Asset technical skills",
      id: "haVipy",
      description:
        "Short title of the 'asset technical skills' section of the job poster template page",
    }),
    longTitle: defineMessage({
      defaultMessage: "Asset technical skills - Examples",
      id: "5zJ+/1",
      description:
        "Long title of the 'asset technical skills' section of the job poster template page",
    }),
  },
} as const;

export default sections;
