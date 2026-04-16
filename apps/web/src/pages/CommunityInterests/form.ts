import type {
  CreateCommunityInterestWithDevelopmentProgramsInput,
  CreateDevelopmentProgramUserInput,
  Maybe,
  UpdateCommunityInterestFormData_FragmentFragment,
  UpdateCommunityInterestInput,
  UpdateDevelopmentProgramInterestHasMany,
} from "@gc-digital-talent/graphql";
import { DevelopmentProgramParticipationStatus } from "@gc-digital-talent/graphql";
import { sortAlphaBy, unpackMaybes } from "@gc-digital-talent/helpers";

import type { SubformValues as FindANewCommunitySubformValues } from "./sections/FindANewCommunity";
import type { SubformValues as TrainingAndDevelopmentOpportunitiesSubformValues } from "./sections/TrainingAndDevelopmentOpportunities";
import type { SubformValues as AdditionalInformationSubformValues } from "./sections/AdditionalInformation";
import type { SubformValues as ReviewAndSubmitSubformValues } from "./sections/ReviewAndSubmit";
import {
  stringArrayToEnumsFinanceChiefDuty,
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

  if (
    formValues.interestInWorkStreamIds !== null &&
    Array.isArray(formValues.interestInWorkStreamIds)
  ) {
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
      formValues.interestInDevelopmentPrograms?.map<CreateDevelopmentProgramUserInput | null>(
        (interest) => {
          if (
            typeof interest.participationStatus === "string" &&
            typeof interest.developmentProgramId === "string"
          ) {
            // valid interest
            return {
              developmentProgramId: interest.developmentProgramId,
              educationExperienceId: null, // for later
              participationStatus: interest.participationStatus,
              completionDate:
                interest.participationStatus ===
                DevelopmentProgramParticipationStatus.Completed
                  ? interest.completionDate
                  : null,
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
  apiInput.communityInterest.financeAdditionalDuties =
    formValues.financeAdditionalDuties
      ? stringArrayToEnumsFinanceChiefDuty(formValues.financeAdditionalDuties)
      : null;
  apiInput.communityInterest.financeOtherRoles = formValues.financeOtherRoles
    ? stringArrayToEnumsFinanceChiefRole(formValues.financeOtherRoles)
    : null;
  apiInput.communityInterest.financeOtherRolesOther =
    formValues.financeOtherRolesOther;

  apiInput.communityInterest.consentToShareProfile = formValues.consent;

  return apiInput;
}

export function formValuesToApiUpdateInput(
  communityInterestId: string,
  interestedPrograms: Map<string, string>,
  formValues: FormValues,
): UpdateCommunityInterestInput {
  const interestInDevelopmentPrograms: UpdateDevelopmentProgramInterestHasMany =
    {};

  formValues.interestInDevelopmentPrograms?.forEach((input) => {
    if (!input.developmentProgramId) return;

    const existingInterest = interestedPrograms.get(input.developmentProgramId);

    if (existingInterest) {
      interestInDevelopmentPrograms.update = [
        ...(interestInDevelopmentPrograms.update ?? []),
        {
          id: existingInterest,
          participationStatus: input.participationStatus,
          completionDate:
            input.participationStatus ===
            DevelopmentProgramParticipationStatus.Completed
              ? input.completionDate
              : null,
        },
      ];
    } else {
      interestInDevelopmentPrograms.create = [
        ...(interestInDevelopmentPrograms.create ?? []),
        {
          communityDevelopmentProgramId: input.developmentProgramId,
          participationStatus: input.participationStatus,
          completionDate:
            input.participationStatus ===
            DevelopmentProgramParticipationStatus.Completed
              ? input.completionDate
              : null,
        },
      ];
    }
  });

  return {
    id: communityInterestId,
    workStreams: {
      sync: formValues.interestInWorkStreamIds,
    },
    jobInterest: parseMaybeStringToBoolean(formValues.jobInterest),
    trainingInterest: parseMaybeStringToBoolean(formValues.trainingInterest),
    additionalInformation: formValues.additionalInformation,
    interestInDevelopmentPrograms,

    // finance-only fields
    financeIsChief: formValues.financeIsChief,
    financeAdditionalDuties: formValues.financeAdditionalDuties
      ? stringArrayToEnumsFinanceChiefDuty(formValues.financeAdditionalDuties)
      : null,
    financeOtherRoles: formValues.financeOtherRoles
      ? stringArrayToEnumsFinanceChiefRole(formValues.financeOtherRoles)
      : null,
    financeOtherRolesOther: formValues.financeOtherRolesOther,

    consentToShareProfile: formValues.consent,
  };
}

interface DevelopmentProgramSlice {
  id: string;
  name?: Maybe<{ localized?: Maybe<string> }>;
}

export function apiDataToFormValues(
  userId: string | null | undefined,
  communityInterest:
    | UpdateCommunityInterestFormData_FragmentFragment
    | null
    | undefined,
  developmentProgramsForCommunity: DevelopmentProgramSlice[],
): FormValues {
  const usersInterestDevelopmentPrograms = unpackMaybes(
    communityInterest?.interestInDevelopmentPrograms,
  );

  // the initial values for FormValues.interestInDevelopmentPrograms must have the maximum length possible, otherwise values are skewed
  // 22 possible programs but 21 interests marked means a skew of one
  // thus build the initial value off community.developmentPrograms instead of communityInterest.interestInDevelopmentPrograms
  developmentProgramsForCommunity.sort(
    sortAlphaBy((devPro) => devPro.name?.localized),
  );
  const initialInterestInDevelopmentPrograms: FormValues["interestInDevelopmentPrograms"] =
    developmentProgramsForCommunity.map((developmentProgram) => {
      const correspondingProgram = usersInterestDevelopmentPrograms.find(
        (userDevPro) =>
          userDevPro.communityDevelopmentProgram?.developmentProgram?.id ===
          developmentProgram.id,
      );
      return {
        developmentProgramId:
          correspondingProgram?.communityDevelopmentProgram.developmentProgram
            .id ?? "",
        participationStatus: correspondingProgram?.participationStatus ?? null,
        completionDate: correspondingProgram?.completionDate ?? null,
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
    financeAdditionalDuties: communityInterest?.financeAdditionalDuties
      ? communityInterest.financeAdditionalDuties.map((duty) => duty.value)
      : null,
    financeOtherRoles: communityInterest?.financeOtherRoles
      ? communityInterest.financeOtherRoles.map((role) => role.value)
      : null,
    financeOtherRolesOther: communityInterest?.financeOtherRolesOther ?? null,

    consent: communityInterest?.consentToShareProfile ?? false,
  };
}
