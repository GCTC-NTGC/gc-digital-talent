import { MessageDescriptor, defineMessages } from "react-intl";
import { ExperienceType } from "~/types/experience";

// Note: Expect this file to grow
// eslint-disable-next-line import/prefer-default-export
export const experienceTypeTitles: Record<ExperienceType, MessageDescriptor> =
  defineMessages({
    work: {
      defaultMessage: "Work experience",
      id: "giUfys",
      description: "Title for work experience section",
    },
    education: {
      defaultMessage: "Education and certificates",
      id: "PFoM2I",
      description: "Title for education experience section",
    },
    community: {
      defaultMessage: "Community participation",
      id: "Uy5Dg2",
      description: "Title for community experience section",
    },
    personal: {
      defaultMessage: "Personal learning",
      id: "UDMUHH",
      description: "Title for personal experience section",
    },
    award: {
      defaultMessage: "Awards and recognition",
      id: "DRYl88",
      description: "Title for award experience section",
    },
  });
