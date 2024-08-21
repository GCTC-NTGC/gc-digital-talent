import { defineMessages, MessageDescriptor } from "react-intl";

// The messages in this object correspond to error messages emitted by the API.
// Ideally, this could be automatically extracted from the schema but for now we do it manually.
// The object keys match their source in the api and return a MessageDescriptor object

export const apiMessages: { [key: string]: MessageDescriptor } = defineMessages(
  {
    "Internal server error": {
      defaultMessage: "Unknown error",
      id: "iqD8qE",
      description: "Fallback text when an error message is not supplied",
    },

    // skill validation
    SkillFamilyKeyStringInUse: {
      defaultMessage: "This skill family key string is already in use",
      id: "XTuwjA",
      description:
        "Error message that the given skill family key is already in use.",
    },
    SkillKeyStringInUse: {
      defaultMessage: "This skill key string is already in use",
      id: "xSecEX",
      description: "Error message that the given skill key is already in use.",
    },

    // pool update
    UpdatePoolClosingDateExtend: {
      defaultMessage:
        "Extended closing date must be after the current closing date.",
      id: "Ork8sR",
      description:
        "Error message that the pool closing date isn't after the existing one",
    },

    // pool publishing validation
    "expiry date required": {
      defaultMessage: "You are missing a required field: End Date",
      id: "XNDPQM",
      description:
        "Error message that the pool advertisement must have an expiry date.",
    },
    "stream required": {
      defaultMessage: "You are missing a required field: Stream/Job Titles",
      id: "w2tWfH",
      description:
        "Error message that the pool advertisement must have a stream.",
    },
    "advertisement language required": {
      defaultMessage: "You are missing a required field: Language requirement",
      id: "J2V3XI",
      description:
        "Error message that the pool advertisement must have an advertisement language.",
    },
    "security clearance required": {
      defaultMessage: "You are missing a required field: Security requirement",
      id: "t4F/0R",
      description:
        "Error message that the pool advertisement must have a security clearance.",
    },
    "is remote required": {
      defaultMessage:
        "Location must be filled in or the Remote option selected",
      id: "3e4sM7",
      description:
        "Error message that the pool advertisement must have location filled.",
    },
    "publishing group required": {
      defaultMessage: "You are missing a required field: Publishing group",
      id: "nPKPFa",
      description:
        "Error message that the pool advertisement must have publishing group filled.",
    },

    RATE_LIMIT: {
      defaultMessage: "Too many requests, please wait a minute and try again.",
      id: "SUYPIt",
      description:
        "Message displayed when number of user attempts exceeds rate limit",
    },
    AUTHORIZATION: {
      defaultMessage:
        "Sorry, you are not authorized to perform this action. If this is a mistake, please contact your administrator about this error.",
      id: "7p6mDv",
      description:
        "Message displayed when user attempts an action they are not allowed to do.",
    },
    NEED_AT_LEAST_ONE_PERSONNEL_REQUIREMENT: {
      defaultMessage: "You must add at least one personnel requirement.",
      description:
        "Message displayed when user attempts to submit a form without at least one personnel requirement",
      id: "2KDa14",
    },
    CannotReopenUsingDeletedSkill: {
      defaultMessage:
        "This process cannot be re-opened. This process contains a required skill that has been deleted.",
      id: "CDJH4s",
      description:
        "Error message for when a process to be re-opened contains a previously deleted skill",
    },
    EssentialSkillsContainsDeleted: {
      defaultMessage:
        "This operation failed. This skill was previously deleted.",
      id: "Me66rb",
      description:
        "Error message for when attempting to delete a previously deleted skill",
    },
    NonEssentialSkillsContainsDeleted: {
      defaultMessage:
        "This operation failed. This skill was previously deleted.",
      id: "Me66rb",
      description:
        "Error message for when attempting to delete a previously deleted skill",
    },
  },
);

export const tryFindMessageDescriptor = (
  defaultMessage: string,
): MessageDescriptor | null => {
  const matchedKey = Object.keys(apiMessages).find(
    (key) => key === defaultMessage,
  );

  if (!matchedKey) return null;

  return apiMessages[matchedKey];
};
