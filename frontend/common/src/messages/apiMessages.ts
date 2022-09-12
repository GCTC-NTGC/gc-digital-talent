import { defineMessages, MessageDescriptor } from "react-intl";

// The messages in this object correspond to error messages emitted by the API.
// Ideally, this could be automatically extracted from the schema but for now we do it manually.
// The object keys match their source in the api by convention but are not actually used for anything

export const messages: { [key: string]: MessageDescriptor } = defineMessages({
  "unique:users,sub": {
    defaultMessage: "This user identifier (sub) is already in use",
    id: "l8p1el",
    description:
      "Error message that the given user identifier is already in use.",
  },
  "unique:users,email": {
    defaultMessage: "This email address is already in use",
    id: "nDaEgr",
    description:
      "Error message that the given email address is already in use.",
  },
  "unique:skill_families,key": {
    defaultMessage: "This skill family key string is already in use",
    id: "XTuwjA",
    description:
      "Error message that the given skill family key is already in use.",
  },
  "validator:archived_at.prohibited": {
    defaultMessage: "already archived",
    id: "OtOIXG",
    description: "Error message that the given model is already archived.",
  },
  "validator:expiry_date.after": {
    defaultMessage: "Expiry Date must be after today.",
    id: "sfr5Pa",
    description:
      "Error message that the given skill expiry date must be after today.",
  },
  "validator:advertisement_location.*.required_if": {
    defaultMessage:
      "You must enter advertisement_location if advertisement is not remote.",
    id: "bhuMGL",
    description:
      "Error message that the pool advertisement must have a location if it is not for remote work.",
  },
  "validator:essential_skills.required": {
    defaultMessage: "You must have at least 1 one essential skill.",
    id: "3GT1s/",
    description:
      "Error message that at least one essential skill must be selected.",
  },
});

export const tryFindMessageDescriptor = (
  defaultMessage: string,
): MessageDescriptor | null => {
  const matchedKey = Object.keys(messages).find(
    (key) => messages[key].defaultMessage === defaultMessage,
  );

  if (!matchedKey) return null;

  return messages[matchedKey];
};
