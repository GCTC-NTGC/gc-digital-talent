import { defineMessage } from "react-intl";

const labels = {
  key: defineMessage({
    defaultMessage: "Key",
    id: "i8zhiL",
    description: "Key",
  }),
  nameEn: defineMessage({
    defaultMessage: "Name (English)",
    id: "ziLrIY",
    description: "The name, in English",
  }),
  nameFr: defineMessage({
    defaultMessage: "Name (French)",
    id: "iceVez",
    description: "The name, in French",
  }),
  descriptionEn: defineMessage({
    defaultMessage: "Description (English)",
    id: "lbmA6Z",
    description: "The description, in English",
  }),
  descriptionFr: defineMessage({
    defaultMessage: "Description (French)",
    id: "06a1X8",
    description: "The description, in French",
  }),
} as const;

export default labels;
