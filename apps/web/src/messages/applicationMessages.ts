import { defineMessages } from "react-intl";

const messages = defineMessages({
  saveContinue: {
    defaultMessage: "Save and continue",
    id: "KZk48E",
    description:
      "Button text to save an application step and continue to the next one",
  },
  saveQuit: {
    defaultMessage: "Save and quit for now",
    id: "U86N4g",
    description: "Action button to save and exit an application",
  },
  numberedStep: {
    defaultMessage: "Step {stepOrdinal}",
    id: "a2ymC3",
    description: "Breadcrumb link text for a numbered application step",
  },
  numberedStepIntro: {
    defaultMessage: "Step {stepOrdinal} (Intro)",
    id: "h8BHov",
    description:
      "Breadcrumb link text for a numbered application step introduction page",
  },
  reservedForIndigenous: {
    defaultMessage: "This opportunity is reserved for Indigenous candidates.",
    id: "+M9Pwt",
    description:
      "Error message displayed when a user's equity information does not match an opportunity",
  },
});

export default messages;
