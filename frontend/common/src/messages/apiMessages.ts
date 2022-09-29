import { defineMessages, MessageDescriptor } from "react-intl";

// The messages in this object correspond to error messages emitted by the API.
// Ideally, this could be automatically extracted from the schema but for now we do it manually.
// The object keys match their source in the api and return a MessageDescriptor object

export const messages: { [key: string]: MessageDescriptor } = defineMessages({
  // users validation
  SubInUse: {
    defaultMessage:
      "Cannot update - this user identifier (sub) is already in use.",
    id: "6O1sjV",
    description:
      "Error message that the given user identifier is already in use when updating.",
  },
  EmailAddressInUse: {
    defaultMessage: "Cannot update - this email address is already in use.",
    id: "VqrVpT",
    description:
      "Error message that the given email address is already in use when updating.",
  },
  CreateUserSubInUse: {
    defaultMessage:
      "Cannot create - this user identifier (sub) is already in use",
    id: "CVmEkf",
    description:
      "Error message that the given user identifier is already in use when creating.",
  },
  CreateUserEmailInUse: {
    defaultMessage: "Cannot create - this email address is already in use.",
    id: "WUAAr1",
    description:
      "Error message that the given user identifier is already in use when creating.",
  },

  // skill validation
  SkillFamilyKeyStringInUse: {
    defaultMessage: "This skill family key string is already in use",
    id: "XTuwjA",
    description:
      "Error message that the given skill family key is already in use.",
  },

  // application validation
  AlreadyArchived: {
    defaultMessage: "Application is already archived.",
    id: "A+dFlE",
    description:
      "Error message that the given application is already archived.",
  },
  AlreadySubmitted: {
    defaultMessage: "Application was already submitted.",
    id: "x/wHOH",
    description:
      "Error message that the given application is already submitted.",
  },
  "pool candidates status InvalidValueArchival": {
    defaultMessage: "This application may not yet be archived.",
    id: "TITln/",
    description: "Error message that the application cannot be archived.",
  },
  "pool candidates status InvalidValueDeletion": {
    defaultMessage: "This application may not be deleted.",
    id: "YUM0Mo",
    description: "Error message that the application cannot be deleted.",
  },

  "validator:expiry_date.after": {
    defaultMessage: "Expiry Date must be after today.",
    id: "sfr5Pa",
    description:
      "Error message that the given skill expiry date must be after today.",
  },

  // pool updating
  UpdatePoolExpiryDate: {
    defaultMessage: "The pool must have an expiry date after today.",
    id: "gU/2O6",
    description: "Error message that pool expiry isn't in the future.",
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
