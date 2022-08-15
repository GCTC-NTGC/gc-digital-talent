import { defineMessages, MessageDescriptor } from "react-intl";

// The messages in this object correspond to error messages emitted by the API.
// Ideally, this could be automatically extracted from the schema but for now we do it manually.

export const messages: { [key: string]: MessageDescriptor } = defineMessages({
  key1: {
    defaultMessage: "This user identifier (sub) is already in use",
    description:
      "Error message that the given user identifier is already in use.",
  },
  key2: {
    defaultMessage: "This email address is already in use",
    description:
      "Error message that the given email address is already in use.",
  },
  key3: {
    defaultMessage: "This skill family key string is already in use",
    description:
      "Error message that the given skill family key is already in use.",
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
