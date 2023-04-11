import { defineMessages, MessageDescriptor } from "react-intl";

// The messages in this object correspond to error messages emitted by the API.
// Ideally, this could be automatically extracted from the schema but for now we do it manually.
// The object keys match their source in the api and return a MessageDescriptor object

export const apiMessages: { [key: string]: MessageDescriptor } = defineMessages(
  {
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
      defaultMessage: "Application is already submitted.",
      id: "76QTNv",
      description:
        "Error message that the given application is already submitted.",
    },
    "pool candidates status InvalidValueArchival": {
      defaultMessage:
        "This application cannot be archived. You can only archive expired applications.",
      id: "TjeaLS",
      description: "Error message that the application cannot be archived.",
    },
    "pool candidates status InvalidValueDeletion": {
      defaultMessage:
        "This application cannot be deleted. You can only delete applications before submission.",
      id: "/I9tx9",
      description: "Error message that the application cannot be deleted.",
    },

    "validator:closing_date.after": {
      defaultMessage: "Closing date must be after today.",
      id: "csLjMi",
      description:
        "Error message that the given skill closing date must be after today.",
    },

    "validator:submitted_at": {
      defaultMessage: "The application must be submitted.",
      id: "mhZmff",
      description:
        "Error message that the given application must already be submitted.",
    },

    // pool updating
    UpdatePoolClosingDate: {
      defaultMessage: "The pool must have a closing date after today.",
      id: "qmEyxS",
      description:
        "Error message that the pool closing date isn't in the future.",
    },

    // pool publishing validation
    EnglishWorkTasksRequired: {
      defaultMessage: "You are missing a required field: English - Your work",
      id: "tW4k56",
      description: "Error message that Work Tasks in English must be filled",
    },
    FrenchWorkTasksRequired: {
      defaultMessage: "You are missing a required field: French - Your work",
      id: "euwgms",
      description: "Error message that Work Tasks in French must be filled",
    },
    EnglishYourImpactRequired: {
      defaultMessage: "You are missing a required field: English - Your impact",
      id: "juklNA",
      description: "Error message that Your Impact in English must be filled",
    },
    FrenchYourImpactRequired: {
      defaultMessage: "You are missing a required field: French - Your impact",
      id: "kg28xx",
      description: "Error message that Your Impact in French must be filled",
    },
    EssentialSkillRequired: {
      defaultMessage: "You must have at least one Essential Skill.",
      id: "Mco0Km",
      description:
        "Error message that at least one Essential Skill is required",
    },
    AdvertisementLocationRequired: {
      defaultMessage:
        "You must fill Specific Location in English and French if advertisement is not remote.",
      id: "aMkZ80",
      description:
        "Error message that advertisement locations must be filled in English and French.",
    },
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
    APPLICATION_EXISTS: {
      defaultMessage: "You have already applied to this pool",
      description:
        "Message displayed when a user attempts to apply to pool more than once",
      id: "0OPWbJ",
    },
    POOL_NOT_PUBLISHED: {
      defaultMessage: "Unable to apply to this pool",
      id: "16AY+M",
      description:
        "Message displayed when user attempts to apply to an unpublished pool",
    },
    POOL_CLOSED: {
      defaultMessage: "Unable to apply to a closed pool",
      id: "Mm+Me1",
      description:
        "Message displayed when user attempts to apply to a closed pool",
    },
    PROFILE_INCOMPLETE: {
      defaultMessage: "Profile is incomplete",
      id: "C/tnCE",
      description:
        "Message displayed when user attempts to apply to a pool with an incomplete profile",
    },
    MISSING_ESSENTIAL_SKILLS: {
      defaultMessage: "Missing essential skills",
      id: "H8eisr",
      description:
        "Message displayed when user attempts to apply to a pool without an essential skill",
    },
    MISSING_LANGUAGE_REQUIREMENTS: {
      defaultMessage: "There is a missing language requirement",
      id: "A1fb/r",
      description:
        "Message displayed when user attempts to apply to a pool without the language requirement",
    },
    SIGNATURE_REQUIRED: {
      defaultMessage: "Signature is a required field",
      id: "J30FT0",
      description:
        "Message displayed when user attempts to apply to a pool without a signature",
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
