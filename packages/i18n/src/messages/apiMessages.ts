import { defineMessages, MessageDescriptor } from "react-intl";

// The messages in this object correspond to error messages emitted by the API.
// Ideally, this could be automatically extracted from the schema but for now we do it manually.
// The object keys match their source in the api and return a MessageDescriptor object

export const apiMessages: Record<string, MessageDescriptor> = defineMessages({
  "Internal server error": {
    defaultMessage: "Unknown error",
    id: "iqD8qE",
    description: "Fallback text when an error message is not supplied",
  },

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
  BothStatusNonStatus: {
    defaultMessage:
      "Please select either Status First Nations or Non-Status First Nations.",
    id: "skfKnv",
    description:
      "Error message that the user has selected both status and non-status first nations.",
  },
  NotIgnorableNotificationFamily: {
    defaultMessage: "Given notification group cannot be ignored.",
    id: "bXECaV",
    description:
      "Error message that the user has attempted to set an invalid notification family as ignored.",
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
  DuplicateUserSkill: {
    defaultMessage: "The skill you selected is already linked to your profile.",
    id: "wUJqDi",
    description:
      "Error message that the skill selected is already linked to the user profile.",
  },

  // team validation
  TeamNameInUse: {
    defaultMessage: "This team name is already in use",
    id: "ctpoN9",
    description: "Error message that the given team name is already in use.",
  },

  // community validation
  CommunityKeyInUse: {
    defaultMessage: "This community key is already in use",
    id: "C/2HT9",
    description: "Error message that the given community key is already in use",
  },

  // department validation
  DepartmentNumberInUse: {
    defaultMessage: "This department number is already in use",
    id: "xH10Pp",
    description:
      "Error message that the input department number is already in use.",
  },

  // application validation
  AlreadySubmitted: {
    defaultMessage: "Application is already submitted.",
    id: "76QTNv",
    description:
      "Error message that the given application is already submitted.",
  },
  "pool candidates status InvalidValueDeletion": {
    defaultMessage:
      "This application cannot be deleted. You can only delete applications before submission.",
    id: "/I9tx9",
    description: "Error message that the application cannot be deleted.",
  },

  ClosingDateRequired: {
    defaultMessage: "You are missing a required field: Closing date",
    id: "oCrAvX",
    description: "Error message that the pool closing date is required.",
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

  ApplicationDeleteFailed: {
    defaultMessage: "Error: deleting application failed",
    id: "M3c9Yo",
    description:
      "Message displayed to user after application fails to get deleted.",
  },

  RemoveCandidateAlreadyPlaced: {
    defaultMessage: "A candidate can't be removed after already being placed.",
    id: "72usGv",
    description:
      "Message displayed to user after attempting to remove an already placed candidate.",
  },
  RemoveCandidateAlreadyRemoved: {
    defaultMessage: "Candidate is already removed.",
    id: "vy6A5+",
    description:
      "Message displayed to user after attempting to remove an already removed candidate.",
  },
  CandidateUnexpectedStatus: {
    defaultMessage: "Candidate has unexpected status.",
    id: "AlECuf",
    description:
      "Message displayed to user after attempting to update a candidate with an unexpected status.",
  },

  // assessmentStep updating
  AssessmentStepsSamePool: {
    defaultMessage: "AssessmentSteps must belong to the same pool.",
    id: "XUR5dD",
    description:
      "Error message that the assessment steps must belong to the same pool.",
  },
  AssessmentStepCannotSwap: {
    defaultMessage: "One or both of the given steps cannot be swapped.",
    id: "l+x5JF",
    description:
      "Error message that one of the assessment steps cannot have its sort order changed.",
  },
  ScreeningQuestionNotExist: {
    defaultMessage: "Given screening question does not exist.",
    id: "2bzpLi",
    description:
      "Error message that the screening question could not be found.",
  },
  PoolSkillNotValid: {
    defaultMessage: "PoolSkill does not exist for given pool.",
    id: "Hu321P",
    description: "Error message that a given pool skill is not valid.",
  },

  // RoD assorted
  ExpiryDateRequired: {
    defaultMessage: "Expiry date is missing. Enter a date.",
    id: "mcL1kc",
    description: "Error message that an expiry date must be added",
  },
  ExpiryDateAfterToday: {
    defaultMessage: "Expiry date must be after today. Enter a valid date.",
    id: "k8IB9g",
    description: "Error message that an expiry date must be in the future",
  },
  InvalidStatusForQualification: {
    defaultMessage:
      "An error occurred during qualification. Contact support if this problem persists.",
    id: "or2gwQ",
    description: "Error message that qualifying a candidate failed",
  },
  InvalidStatusForDisqualification: {
    defaultMessage:
      "An error occurred during disqualification. Contact support if this problem persists.",
    id: "IxWjU1",
    description: "Error message that disqualifying a candidate failed",
  },
  InvalidStatusForRevertFinalDecision: {
    defaultMessage:
      "An error occurred while reverting final decision. Contact support if this problem persists.",
    id: "556RGm",
    description:
      "Error message that reverting the final decision for a candidate failed",
  },
  InvalidStatusForPlacing: {
    defaultMessage:
      "An error occurred while placing the candidate. Contact support if this problem persists.",
    id: "8kUa5H",
    description: "Error message that placing a candidate failed",
  },
  CandidateNotPlaced: {
    defaultMessage:
      "An error occurred while placing the candidate. Contact support if this problem persists.",
    id: "8kUa5H",
    description: "Error message that placing a candidate failed",
  },

  // pool updating
  UpdatePoolClosingDateFuture: {
    defaultMessage: "The pool must have a closing date after today.",
    id: "qmEyxS",
    description:
      "Error message that the pool closing date isn't in the future.",
  },
  UpdatePoolClosingDateExtend: {
    defaultMessage:
      "Extended closing date must be after the current closing date.",
    id: "Ork8sR",
    description:
      "Error message that the pool closing date isn't after the existing one",
  },
  // pool archiving
  ArchivePoolInvalidStatus: {
    defaultMessage:
      "You cannot archive a pool unless it is in the closed status.",
    id: "7D58wn",
    description:
      "Error message when attempting to archive a pool with an invalid status.",
  },
  UnarchivePoolInvalidStatus: {
    defaultMessage:
      "You cannot un-archive a pool unless it is in the archived status.",
    id: "hpBnAk",
    description:
      "Error message when attempting to un-archive a pool with an invalid status.",
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
  EnglishSpecialNoteRequired: {
    defaultMessage:
      "You are missing a required field: English - Special note for this process",
    id: "S2BTqm",
    description:
      "Error message that Special note for this process in English must be filled",
  },
  FrenchSpecialNoteRequired: {
    defaultMessage:
      "You are missing a required field: French - Special note for this process",
    id: "NQhU3F",
    description:
      "Error message that Special note for this process in French must be filled",
  },
  EssentialSkillRequired: {
    defaultMessage: "You must have at least one Essential Skill.",
    id: "Mco0Km",
    description: "Error message that at least one Essential Skill is required",
  },
  PoolLocationRequired: {
    defaultMessage:
      "You must fill Specific location in English and French if advertisement is not remote.",
    id: "CYirJF",
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
    defaultMessage: "Location must be filled in or the Remote option selected",
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
  AssessmentStepMissingSkills: {
    defaultMessage:
      "Each assessment must include one or more skills for evaluation",
    description:
      "Error message that the pool advertisement assessments are lacking a skill",
    id: "7QH2G/",
  },
  PoolSkillsWithoutAssessments: {
    defaultMessage: "Each skill must be included in an assessment",
    description:
      "Error message that the pool advertisement skills are lacking an assessment",
    id: "kDw+xr",
  },
  PoolSkillNotEssentialAndAssetTypes: {
    defaultMessage:
      "You can't include a skill as both essential and an asset in the same process. Please choose one and remove it from the other section.",
    description:
      "Error message that the pool advertisement skills cannot be both essential and asset",
    id: "kHtt2N",
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
    defaultMessage:
      "Please connect at least one career timeline experience to each required technical skill and ensure each skill has details about how you used it.",
    id: "lXgeJr",
    description:
      "Message displayed when user attempts to apply to a pool without connecting all essential skills.",
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
  EDUCATION_REQUIREMENT_INCOMPLETE: {
    defaultMessage: "Education requirement is incomplete",
    id: "V3+fXY",
    description:
      "Message displayed when user attempts to apply to a pool with incomplete education requirement",
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
  MISSING_QUESTION_RESPONSE: {
    defaultMessage: "You must answer all screening questions",
    id: "LBqw5w",
    description:
      "Message displayed when user attempts to apply to a pool without answering all screening questions",
  },
  VERIFICATION_FAILED: {
    defaultMessage: "Verification failed.",
    id: "XFFFCu",
    description: "Error message that the verification was not successful.",
  },

  SkillUsedByActivePoster: {
    defaultMessage:
      "This skill cannot be deleted. The skill is in use by a process that is currently accepting applications.",
    id: "/qdFyj",
    description: "Error message for when skill is used by an active process",
  },
  CannotReopenUsingDeletedSkill: {
    defaultMessage:
      "This process cannot be re-opened. This process contains a required skill that has been deleted.",
    id: "CDJH4s",
    description:
      "Error message for when a process to be re-opened contains a previously deleted skill",
  },
  FailedDueToSkillBeingDeleted: {
    defaultMessage: "This operation failed. This skill was previously deleted.",
    id: "Me66rb",
    description:
      "Error message for when attempting to delete a previously deleted skill",
  },
  EssentialSkillsContainsDeleted: {
    defaultMessage: "This operation failed. This skill was previously deleted.",
    id: "Me66rb",
    description:
      "Error message for when attempting to delete a previously deleted skill",
  },
  NonEssentialSkillsContainsDeleted: {
    defaultMessage: "This operation failed. This skill was previously deleted.",
    id: "Me66rb",
    description:
      "Error message for when attempting to delete a previously deleted skill",
  },
  TEAM_ID_REQUIRED: {
    defaultMessage:
      "An error occurred during role assignment. Contact support if this problem persists.",
    id: "9QsHXO",
    description:
      "Error message for when an error occurs during role assignment",
  },
  TEAM_DOES_NOT_EXIST: {
    defaultMessage:
      "An error occurred during role assignment. Contact support if this problem persists.",
    id: "9QsHXO",
    description:
      "Error message for when an error occurs during role assignment",
  },
  ROLE_NOT_TEAM_ROLE: {
    defaultMessage:
      "An error occurred during role assignment. Contact support if this problem persists.",
    id: "9QsHXO",
    description:
      "Error message for when an error occurs during role assignment",
  },
  ROLE_NOT_FOUND: {
    defaultMessage:
      "An error occurred during role assignment. Contact support if this problem persists.",
    id: "9QsHXO",
    description:
      "Error message for when an error occurs during role assignment",
  },
  NotVerifiedGovEmployee: {
    defaultMessage: "This user hasn't verified their employee status",
    id: "m/VZ/H",
    description: "Error message for when a user is not verified",
  },
  TalentEventIsClosed: {
    defaultMessage:
      "The deadline for this talent management event has passed. You can no longer submit a nomination.",
    id: "nuFcSO",
    description:
      "Error alerting the user it is to late to create/update a nomination",
  },
});

export const tryFindMessageDescriptor = (
  defaultMessage: string,
): MessageDescriptor | null => {
  const matchedKey = Object.keys(apiMessages).find(
    (key) => key === defaultMessage,
  );

  if (!matchedKey) return null;

  return apiMessages[matchedKey];
};
