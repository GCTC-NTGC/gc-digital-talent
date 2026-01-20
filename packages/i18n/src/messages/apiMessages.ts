import { defineMessages, MessageDescriptor } from "react-intl";

import { ErrorCode } from "@gc-digital-talent/graphql";

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
  [ErrorCode.SubInUse]: {
    defaultMessage:
      "Cannot update - this user identifier (sub) is already in use.",
    id: "6O1sjV",
    description:
      "Error message that the given user identifier is already in use when updating.",
  },
  [ErrorCode.EmailAddressInUse]: {
    defaultMessage: "Cannot update - this email address is already in use.",
    id: "VqrVpT",
    description:
      "Error message that the given email address is already in use when updating.",
  },
  [ErrorCode.BothStatusNonStatus]: {
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
  [ErrorCode.DuplicateUserSkill]: {
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
  [ErrorCode.DepartmentNumberInUse]: {
    defaultMessage: "This department number is already in use",
    id: "xH10Pp",
    description:
      "Error message that the input department number is already in use.",
  },

  // work stream validation
  [ErrorCode.WorkStreamNameInUse]: {
    defaultMessage: "This work stream name is already in use",
    id: "yg8m7r",
    description:
      "Error message that the input work stream name is already in use.",
  },

  // application validation
  [ErrorCode.ApplicationAlreadySubmitted]: {
    defaultMessage: "Application is already submitted.",
    id: "76QTNv",
    description:
      "Error message that the given application is already submitted.",
  },
  [ErrorCode.ApplicationNotDraft]: {
    defaultMessage:
      "This application cannot be deleted. You can only delete applications before submission.",
    id: "/I9tx9",
    description: "Error message that the application cannot be deleted.",
  },

  [ErrorCode.ClosingDateRequired]: {
    defaultMessage: "You are missing a required field: Closing date",
    id: "oCrAvX",
    description: "Error message that the pool closing date is required.",
  },
  [ErrorCode.ClosingDateFuture]: {
    defaultMessage: "Closing date must be after today.",
    id: "csLjMi",
    description:
      "Error message that the given skill closing date must be after today.",
  },

  [ErrorCode.ApplicationNotSubmitted]: {
    defaultMessage: "The application must be submitted.",
    id: "mhZmff",
    description:
      "Error message that the given application must already be submitted.",
  },

  [ErrorCode.ApplicationDeleteFailed]: {
    defaultMessage: "Error: deleting application failed",
    id: "M3c9Yo",
    description:
      "Message displayed to user after application fails to get deleted.",
  },

  [ErrorCode.RemoveCandidateAlreadyPlaced]: {
    defaultMessage: "A candidate can't be removed after already being placed.",
    id: "72usGv",
    description:
      "Message displayed to user after attempting to remove an already placed candidate.",
  },
  [ErrorCode.RemoveCandidateAlreadyRemoved]: {
    defaultMessage: "Candidate is already removed.",
    id: "vy6A5+",
    description:
      "Message displayed to user after attempting to remove an already removed candidate.",
  },
  [ErrorCode.CandidateUnexpectedStatus]: {
    defaultMessage: "Candidate has unexpected status.",
    id: "AlECuf",
    description:
      "Message displayed to user after attempting to update a candidate with an unexpected status.",
  },

  // assessmentStep updating
  [ErrorCode.AssessmentStepsSamePool]: {
    defaultMessage: "AssessmentSteps must belong to the same pool.",
    id: "XUR5dD",
    description:
      "Error message that the assessment steps must belong to the same pool.",
  },
  [ErrorCode.AssessmentStepCannotSwap]: {
    defaultMessage: "One or both of the given steps cannot be swapped.",
    id: "l+x5JF",
    description:
      "Error message that one of the assessment steps cannot have its sort order changed.",
  },
  [ErrorCode.ScreeningQuestionNotFound]: {
    defaultMessage: "Given screening question does not exist.",
    id: "2bzpLi",
    description:
      "Error message that the screening question could not be found.",
  },
  [ErrorCode.PoolSkillNotValid]: {
    defaultMessage: "PoolSkill does not exist for given pool.",
    id: "Hu321P",
    description: "Error message that a given pool skill is not valid.",
  },

  // RoD assorted
  [ErrorCode.ExpiryDateRequired]: {
    defaultMessage: "Expiry date is missing. Enter a date.",
    id: "mcL1kc",
    description: "Error message that an expiry date must be added",
  },
  [ErrorCode.ExpiryDateAfterToday]: {
    defaultMessage: "Expiry date must be after today. Enter a valid date.",
    id: "k8IB9g",
    description: "Error message that an expiry date must be in the future",
  },
  [ErrorCode.InvalidStatusQualification]: {
    defaultMessage:
      "An error occurred during qualification. Contact support if this problem persists.",
    id: "or2gwQ",
    description: "Error message that qualifying a candidate failed",
  },
  [ErrorCode.InvalidStatusDisqualification]: {
    defaultMessage:
      "An error occurred during disqualification. Contact support if this problem persists.",
    id: "IxWjU1",
    description: "Error message that disqualifying a candidate failed",
  },
  [ErrorCode.InvalidStatusRevertFinalDecision]: {
    defaultMessage:
      "An error occurred while reverting final decision. Contact support if this problem persists.",
    id: "556RGm",
    description:
      "Error message that reverting the final decision for a candidate failed",
  },
  [ErrorCode.InvalidStatusPlacing]: {
    defaultMessage:
      "An error occurred while placing the candidate. Contact support if this problem persists.",
    id: "8kUa5H",
    description: "Error message that placing a candidate failed",
  },
  [ErrorCode.CandidateNotPlaced]: {
    defaultMessage:
      "An error occurred while placing the candidate. Contact support if this problem persists.",
    id: "8kUa5H",
    description: "Error message that placing a candidate failed",
  },

  // pool updating
  [ErrorCode.ProcessClosingDateFuture]: {
    defaultMessage: "The pool must have a closing date after today.",
    id: "qmEyxS",
    description:
      "Error message that the pool closing date isn't in the future.",
  },
  [ErrorCode.ProcessClosingDateExtend]: {
    defaultMessage:
      "Extended closing date must be after the current closing date.",
    id: "Ork8sR",
    description:
      "Error message that the pool closing date isn't after the existing one",
  },
  // pool archiving
  [ErrorCode.ArchivePoolInvalidStatus]: {
    defaultMessage:
      "You cannot archive a pool unless it is in the closed status.",
    id: "7D58wn",
    description:
      "Error message when attempting to archive a pool with an invalid status.",
  },
  [ErrorCode.UnarchivePoolInvalidStatus]: {
    defaultMessage:
      "You cannot un-archive a pool unless it is in the archived status.",
    id: "hpBnAk",
    description:
      "Error message when attempting to un-archive a pool with an invalid status.",
  },

  // pool publishing validation
  [ErrorCode.EnglishKeyTasksRequired]: {
    defaultMessage:
      "You are missing a required field: Common tasks in this role (English)",
    id: "n0c2W8",
    description: "Error message that Work Tasks in English must be filled",
  },
  [ErrorCode.FrenchKeyTasksRequired]: {
    defaultMessage:
      "You are missing a required field: Common tasks in this role (French)",
    id: "lYBehZ",
    description: "Error message that Work Tasks in French must be filled",
  },
  [ErrorCode.EnglishYourImpactRequired]: {
    defaultMessage: "You are missing a required field: Your impact (English)",
    id: "xmzq/b",
    description: "Error message that Your Impact in English must be filled",
  },
  [ErrorCode.FrenchYourImpactRequired]: {
    defaultMessage: "You are missing a required field: Your impact (French)",
    id: "exmV4s",
    description: "Error message that Your Impact in French must be filled",
  },
  [ErrorCode.EnglishSpecialNoteRequired]: {
    defaultMessage: "You are missing a required field: Special note (English)",
    id: "1NOBzf",
    description:
      "Error message that Special note for this process in English must be filled",
  },
  [ErrorCode.FrenchSpecialNoteRequired]: {
    defaultMessage: "You are missing a required field: Special note (French)",
    id: "ygMrNM",
    description:
      "Error message that Special note for this process in French must be filled",
  },
  [ErrorCode.EssentialSkillRequired]: {
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
  [ErrorCode.AssessmentStepMissingSkills]: {
    defaultMessage:
      "Each assessment must include one or more skills for evaluation",
    description:
      "Error message that the pool advertisement assessments are lacking a skill",
    id: "7QH2G/",
  },
  [ErrorCode.PoolSkillsWithoutAssessments]: {
    defaultMessage: "Each skill must be included in an assessment",
    description:
      "Error message that the pool advertisement skills are lacking an assessment",
    id: "kDw+xr",
  },
  [ErrorCode.PoolSkillNotEssentialAndAssetTypes]: {
    defaultMessage:
      "You can't include a skill as both essential and an asset in the same process. Please choose one and remove it from the other section.",
    description:
      "Error message that the pool advertisement skills cannot be both essential and asset",
    id: "kHtt2N",
  },
  [ErrorCode.ApplicationExists]: {
    defaultMessage: "You have already applied to this pool",
    description:
      "Message displayed when a user attempts to apply to pool more than once",
    id: "0OPWbJ",
  },
  [ErrorCode.ApplicationPoolNotPublished]: {
    defaultMessage: "Unable to apply to this pool",
    id: "16AY+M",
    description:
      "Message displayed when user attempts to apply to an unpublished pool",
  },
  [ErrorCode.ApplicationPoolClosed]: {
    defaultMessage: "Unable to apply to a closed pool",
    id: "Mm+Me1",
    description:
      "Message displayed when user attempts to apply to a closed pool",
  },
  [ErrorCode.ApplicationProfileIncomplete]: {
    defaultMessage: "Profile is incomplete",
    id: "C/tnCE",
    description:
      "Message displayed when user attempts to apply to a pool with an incomplete profile",
  },
  [ErrorCode.ApplicationMissingEssentialSkills]: {
    defaultMessage:
      "Please connect at least one career timeline experience to each required technical skill and ensure each skill has details about how you used it.",
    id: "lXgeJr",
    description:
      "Message displayed when user attempts to apply to a pool without connecting all essential skills.",
  },
  [ErrorCode.ApplicationMissingLanguageRequirements]: {
    defaultMessage: "There is a missing language requirement",
    id: "A1fb/r",
    description:
      "Message displayed when user attempts to apply to a pool without the language requirement",
  },
  [ErrorCode.ApplicationSignatureRequired]: {
    defaultMessage: "Signature is a required field",
    id: "J30FT0",
    description:
      "Message displayed when user attempts to apply to a pool without a signature",
  },
  [ErrorCode.ApplicationEducationRequirementIncomplete]: {
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
  [ErrorCode.ApplicationMissingQuestionResponse]: {
    defaultMessage: "You must answer all screening questions",
    id: "LBqw5w",
    description:
      "Message displayed when user attempts to apply to a pool without answering all screening questions",
  },
  [ErrorCode.VerificationFailed]: {
    defaultMessage: "Verification failed.",
    id: "XFFFCu",
    description: "Error message that the verification was not successful.",
  },

  [ErrorCode.SkillUsedActivePoster]: {
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
  [ErrorCode.EssentialSkillsContainsDeleted]: {
    defaultMessage: "This operation failed. This skill was previously deleted.",
    id: "Me66rb",
    description:
      "Error message for when attempting to delete a previously deleted skill",
  },
  [ErrorCode.NonessentialSkillsContainsDeleted]: {
    defaultMessage: "This operation failed. This skill was previously deleted.",
    id: "Me66rb",
    description:
      "Error message for when attempting to delete a previously deleted skill",
  },
  [ErrorCode.TeamIdRequired]: {
    defaultMessage:
      "An error occurred during role assignment. Contact support if this problem persists.",
    id: "9QsHXO",
    description:
      "Error message for when an error occurs during role assignment",
  },
  [ErrorCode.TeamDoesNotExist]: {
    defaultMessage:
      "An error occurred during role assignment. Contact support if this problem persists.",
    id: "9QsHXO",
    description:
      "Error message for when an error occurs during role assignment",
  },
  [ErrorCode.RoleNotTeamRole]: {
    defaultMessage:
      "An error occurred during role assignment. Contact support if this problem persists.",
    id: "9QsHXO",
    description:
      "Error message for when an error occurs during role assignment",
  },
  [ErrorCode.RoleNotFound]: {
    defaultMessage:
      "An error occurred during role assignment. Contact support if this problem persists.",
    id: "9QsHXO",
    description:
      "Error message for when an error occurs during role assignment",
  },
  [ErrorCode.NotVerifiedGovernmentEmployee]: {
    defaultMessage: "This user hasn't verified their employee status",
    id: "m/VZ/H",
    description: "Error message for when a user is not verified",
  },
  [ErrorCode.TalentEventIsClosed]: {
    defaultMessage:
      "The deadline for this talent management event has passed. You can no longer submit a nomination.",
    id: "nuFcSO",
    description:
      "Error alerting the user it is to late to create/update a nomination",
  },
  [ErrorCode.ContactEmailRequired]: {
    defaultMessage: "You are missing a required field: Contact email",
    id: "9wqUyU",
    description:
      "Error message that contact email for this process must be filled",
  },
  [ErrorCode.MissingSubstantiveExperience]: {
    defaultMessage:
      "You can’t save this option as your workforce adjustment situation if your current position is missing, not marked as substantive, or not marked as a Government of Canada experience. Please update your career experience to continue.",
    id: "OKhXQk",
    description:
      "Error message for when a user is missing a substantive experience for workforce adjustment",
  },
  [ErrorCode.ApplicationWorkEmailNotVerified]: {
    defaultMessage:
      "This job opportunity is reserved for existing employees. A verified Government of Canada work email is required.",
    id: "OJVUdM",
    description:
      "Error message for when user submits an application to an internal pool with an unverified work email",
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
