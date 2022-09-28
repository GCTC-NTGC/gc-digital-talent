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

  // pool publishing validation
  EnglishWorkTasksRequired: {
    defaultMessage: "English - Work Tasks is required.",
    id: "sWfvhe",
    description: "Error message that Work Tasks in English must be filled",
  },
  FrenchWorkTasksRequired: {
    defaultMessage: "French - Work Tasks is required.",
    id: "/75c61",
    description: "Error message that Work Tasks in French must be filled",
  },
  EnglishYourImpactRequired: {
    defaultMessage: "English - Your Impact is required.",
    id: "sE3hl+",
    description: "Error message that Your Impact in English must be filled",
  },
  FrenchYourImpactRequired: {
    defaultMessage: "French - Your Impact is required.",
    id: "hxs++x",
    description: "Error message that Your Impact in French must be filled",
  },
  EssentialSkillRequired: {
    defaultMessage: "You must have at least one Essential Skill.",
    id: "Mco0Km",
    description: "Error message that at least one Essential Skill is required",
  },
  AdvertisementLocationRequired: {
    defaultMessage:
      "You must enter Advertisement Location in both languages if advertisement is not remote.",
    id: "m/pEFY",
    description:
      "Error message that advertisement locations must both be filled.",
  },
  "expiry date required": {
    defaultMessage: "An Expiry Date is required.",
    id: "+jrWEb",
    description:
      "Error message that the pool advertisement must have an expiry date.",
  },
  "stream required": {
    defaultMessage: "A Stream selection is required.",
    id: "KWkTXZ",
    description:
      "Error message that the pool advertisement must have a stream.",
  },
  "advertisement language required": {
    defaultMessage: "An Advertisement Language selection is required.",
    id: "EFH6Pt",
    description:
      "Error message that the pool advertisement must have an advertisement language.",
  },
  "security clearance required": {
    defaultMessage: "A Security Clearance selection is required.",
    id: "QAvKyg",
    description:
      "Error message that the pool advertisement must have a security clearance.",
  },
  "is remote required": {
    defaultMessage: "Location must be filled in or the Remote option selected",
    id: "3e4sM7",
    description:
      "Error message that the pool advertisement must have location filled.",
  },
});

export const tryFindMessageDescriptor = (
  defaultMessage: string,
): MessageDescriptor | null => {
  const matchedKey = Object.keys(messages).find(
    (key) => key === defaultMessage,
  );

  if (!matchedKey) return null;

  return messages[matchedKey];
};
