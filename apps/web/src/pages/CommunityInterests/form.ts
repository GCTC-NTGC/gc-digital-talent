import type {
  CreateCommunityInterestWithDevelopmentProgramsInput,
  UpdateCommunityInterestFormData_FragmentFragment,
  UpdateCommunityInterestWithDevelopmentProgramsInput,
  UpsertDevelopmentProgramUserInput,
  DevelopmentProgramUserRecordsTrainingAndDevelopmentOpportunitiesFragmentFragment as DevelopmentProgramUserRecordsTrainingAndDevelopmentOpportunitiesFragmentType,
} from "@gc-digital-talent/graphql";
import { DevelopmentProgramParticipationStatus } from "@gc-digital-talent/graphql";
import { sortAlphaBy, unpackMaybes } from "@gc-digital-talent/helpers";

import type { SubformValues as FindANewCommunitySubformValues } from "./sections/FindANewCommunity";
import type { SubformValues as TrainingAndDevelopmentOpportunitiesSubformValues } from "./sections/TrainingAndDevelopmentOpportunities";
import type { SubformValues as AdditionalInformationSubformValues } from "./sections/AdditionalInformation";
import type { SubformValues as ReviewAndSubmitSubformValues } from "./sections/ReviewAndSubmit";
import {
  stringArrayToEnumsCommunityInterestAdditionalDuty,
  stringArrayToEnumsFinanceChiefRole,
} from "./util";

export interface FormValues
  extends
    FindANewCommunitySubformValues,
    TrainingAndDevelopmentOpportunitiesSubformValues,
    AdditionalInformationSubformValues,
    ReviewAndSubmitSubformValues {
  userId: string | null;
}

function parseMaybeStringToBoolean(value: string | null | undefined): boolean {
  if (typeof value === "string" && value.toLocaleLowerCase() === "true") {
    return true;
  }

  return false;
}

export function formValuesToApiCreateInput(
  formValues: FormValues,
): CreateCommunityInterestWithDevelopmentProgramsInput {
  if (!formValues.userId) {
    throw new Error("User ID is required");
  }
  if (!formValues.communityId) {
    throw new Error("Community ID is required");
  }

  // mandatory fields
  const apiInput: CreateCommunityInterestWithDevelopmentProgramsInput = {
    userId: formValues.userId,
    communityInterest: {
      communityId: formValues.communityId,
    },
  };

  if (formValues.interestInWorkStreamIds !== null) {
    apiInput.communityInterest.workStreams = {
      sync: formValues.interestInWorkStreamIds,
    };
  }

  if (formValues.jobInterest !== null) {
    apiInput.communityInterest.jobInterest = parseMaybeStringToBoolean(
      formValues.jobInterest,
    );
  }

  if (formValues.trainingInterest !== null) {
    apiInput.communityInterest.trainingInterest = parseMaybeStringToBoolean(
      formValues.trainingInterest,
    );
  }

  if (formValues.additionalInformation !== null) {
    apiInput.communityInterest.additionalInformation =
      formValues.additionalInformation;
  }

  if (formValues.interestInDevelopmentPrograms !== null) {
    const interests =
      formValues.interestInDevelopmentPrograms?.map<UpsertDevelopmentProgramUserInput | null>(
        (interest) => {
          if (
            typeof interest.participationStatus === "string" &&
            typeof interest.developmentProgramId === "string"
          ) {
            // valid interest
            return {
              developmentProgramId: interest.developmentProgramId,
              educationExperienceId:
                interest.participationStatus ===
                DevelopmentProgramParticipationStatus.Completed
                  ? (interest.educationExperienceId ?? null)
                  : null,
              participationStatus: interest.participationStatus,
            };
          }
          // no participation status or development program ID
          return null;
        },
      );
    apiInput.developmentPrograms = unpackMaybes(interests);
  }

  // finance-only fields
  apiInput.communityInterest.financeIsChief = formValues.financeIsChief;
  apiInput.communityInterest.financeOtherRoles = formValues.financeOtherRoles
    ? stringArrayToEnumsFinanceChiefRole(formValues.financeOtherRoles)
    : null;
  apiInput.communityInterest.financeOtherRolesOther =
    formValues.financeOtherRolesOther;

  // procurement-only fields
  apiInput.communityInterest.procurementIsSDO = formValues.procurementIsSDO;

  // shared between finance and procurement
  apiInput.communityInterest.communityInterestAdditionalDuties =
    formValues.communityInterestAdditionalDuties
      ? stringArrayToEnumsCommunityInterestAdditionalDuty(
          formValues.communityInterestAdditionalDuties,
        )
      : null;

  apiInput.communityInterest.consentToShareProfile = formValues.consent;

  return apiInput;
}

export function formValuesToApiUpdateInput(
  communityInterestId: string,
  formValues: FormValues,
): UpdateCommunityInterestWithDevelopmentProgramsInput {
  let interests: UpsertDevelopmentProgramUserInput[] | undefined = undefined;

  if (formValues.interestInDevelopmentPrograms !== null) {
    const interestsWithNulls =
      formValues.interestInDevelopmentPrograms?.map<UpsertDevelopmentProgramUserInput | null>(
        (interest) => {
          if (
            typeof interest.participationStatus === "string" &&
            typeof interest.developmentProgramId === "string"
          ) {
            // valid interest
            return {
              developmentProgramId: interest.developmentProgramId,
              educationExperienceId:
                interest.participationStatus ===
                DevelopmentProgramParticipationStatus.Completed
                  ? (interest.educationExperienceId ?? null)
                  : null,
              participationStatus: interest.participationStatus,
            };
          }
          // no participation status or development program ID
          return null;
        },
      );

    interests = unpackMaybes(interestsWithNulls);
  }

  return {
    id: communityInterestId,
    communityInterest: {
      jobInterest: parseMaybeStringToBoolean(formValues.jobInterest),
      trainingInterest: parseMaybeStringToBoolean(formValues.trainingInterest),
      additionalInformation: formValues.additionalInformation,

      // finance-only fields
      financeIsChief: formValues.financeIsChief,
      financeOtherRoles: formValues.financeOtherRoles
        ? stringArrayToEnumsFinanceChiefRole(formValues.financeOtherRoles)
        : null,
      financeOtherRolesOther: formValues.financeOtherRolesOther,

      // procurement-only fields
      procurementIsSDO: formValues.procurementIsSDO,

      // shared between finance and procurement
      communityInterestAdditionalDuties:
        formValues.communityInterestAdditionalDuties
          ? stringArrayToEnumsCommunityInterestAdditionalDuty(
              formValues.communityInterestAdditionalDuties,
            )
          : null,

      consentToShareProfile: formValues.consent,

      workStreams: {
        sync: formValues.interestInWorkStreamIds,
      },
    },
    developmentPrograms: interests,
  };
}

interface DevelopmentProgramSlice {
  id: string;
  name?: { localized?: string | null | undefined } | null;
}

export function apiDataToFormValues(
  userId: string | null | undefined,
  developmentProgramUserRecords: DevelopmentProgramUserRecordsTrainingAndDevelopmentOpportunitiesFragmentType[],
  communityInterest:
    UpdateCommunityInterestFormData_FragmentFragment | null | undefined,
  developmentProgramsForCommunity: DevelopmentProgramSlice[],
): FormValues {
  // the initial values for FormValues.interestInDevelopmentPrograms must have the maximum length possible, otherwise values are skewed
  // 22 possible programs but 21 interests marked means a skew of one
  // thus build the initial value off community.developmentPrograms instead of communityInterest.interestInDevelopmentPrograms
  developmentProgramsForCommunity.sort(
    sortAlphaBy((devPro) => devPro.name?.localized),
  );
  const initialInterestInDevelopmentPrograms: FormValues["interestInDevelopmentPrograms"] =
    developmentProgramsForCommunity.map((developmentProgram) => {
      const correspondingProgram = developmentProgramUserRecords.find(
        (developmentProgramUser) =>
          developmentProgramUser.developmentProgram.id ===
          developmentProgram.id,
      );
      return {
        developmentProgramId: developmentProgram.id,
        participationStatus: correspondingProgram?.participationStatus ?? null,
        educationExperienceId:
          correspondingProgram?.educationExperience?.id ?? null,
      };
    });

  return {
    userId: userId ?? null,
    communityId: communityInterest?.community.id ?? null,
    interestInWorkStreamIds:
      communityInterest?.workStreams?.map((ws) => ws.id) ?? [],
    jobInterest: communityInterest?.jobInterest?.toString() ?? null,
    trainingInterest: communityInterest?.trainingInterest?.toString() ?? null,
    additionalInformation: communityInterest?.additionalInformation ?? null,
    interestInDevelopmentPrograms: initialInterestInDevelopmentPrograms,

    // finance-only fields
    financeIsChief: communityInterest?.financeIsChief ?? null,
    financeOtherRoles: communityInterest?.financeOtherRoles
      ? communityInterest.financeOtherRoles.map((role) => role.value)
      : null,
    financeOtherRolesOther: communityInterest?.financeOtherRolesOther ?? null,

    // procurement-only fields
    procurementIsSDO: communityInterest?.procurementIsSDO ?? null,

    // shared between finance and procurement
    communityInterestAdditionalDuties:
      communityInterest?.communityInterestAdditionalDuties
        ? communityInterest.communityInterestAdditionalDuties.map(
            (duty) => duty.value,
          )
        : null,

    consent: communityInterest?.consentToShareProfile ?? false,
  };
}
