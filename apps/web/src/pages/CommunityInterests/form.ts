import {
  CreateCommunityInterestInput,
  CreateDevelopmentProgramInterestInput,
  DevelopmentProgramParticipationStatus,
  Maybe,
  UpdateCommunityInterestFormData_FragmentFragment,
  UpdateCommunityInterestInput,
  UpdateDevelopmentProgramInterestHasMany,
} from "@gc-digital-talent/graphql";
import { sortAlphaBy, unpackMaybes } from "@gc-digital-talent/helpers";

import { SubformValues as FindANewCommunitySubformValues } from "./sections/FindANewCommunity";
import { SubformValues as TrainingAndDevelopmentOpportunitiesSubformValues } from "./sections/TrainingAndDevelopmentOpportunities";
import { SubformValues as AdditionalInformationSubformValues } from "./sections/AdditionalInformation";
import { SubformValues as ReviewAndSubmitSubformValues } from "./sections/ReviewAndSubmit";
import {
  stringArrayToEnumsFinanceChiefDuty,
  stringArrayToEnumsFinanceChiefRole,
} from "./util";

export interface FormValues
  extends FindANewCommunitySubformValues,
    TrainingAndDevelopmentOpportunitiesSubformValues,
    AdditionalInformationSubformValues,
    ReviewAndSubmitSubformValues {
  userId: string | null;
}

export function parseMaybeStringToBoolean(
  value: string | null | undefined,
): boolean {
  if (typeof value === "string" && value.toLocaleLowerCase() === "true") {
    return true;
  }

  return false;
}

export function formValuesToApiCreateInput(
  formValues: FormValues,
): CreateCommunityInterestInput {
  if (!formValues.userId) {
    throw new Error("User ID is required");
  }
  if (!formValues.communityId) {
    throw new Error("Community ID is required");
  }

  // mandatory fields
  const apiInput: CreateCommunityInterestInput = {
    userId: formValues.userId,
    community: {
      connect: formValues.communityId,
    },
  };

  if (
    formValues.interestInWorkStreamIds !== null &&
    Array.isArray(formValues.interestInWorkStreamIds)
  ) {
    apiInput.workStreams = {
      sync: formValues.interestInWorkStreamIds,
    };
  }

  if (formValues.jobInterest !== null) {
    apiInput.jobInterest = parseMaybeStringToBoolean(formValues.jobInterest);
  }

  if (formValues.trainingInterest !== null) {
    apiInput.trainingInterest = parseMaybeStringToBoolean(
      formValues.trainingInterest,
    );
  }

  if (formValues.additionalInformation !== null) {
    apiInput.additionalInformation = formValues.additionalInformation;
  }

  if (formValues.interestInDevelopmentPrograms !== null) {
    const interests =
      formValues.interestInDevelopmentPrograms?.map<CreateDevelopmentProgramInterestInput | null>(
        (interest) => {
          if (
            typeof interest.participationStatus === "string" &&
            typeof interest.developmentProgramId === "string"
          ) {
            // valid interest
            return {
              developmentProgramId: interest.developmentProgramId,
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
    apiInput.interestInDevelopmentPrograms = {
      create: unpackMaybes(interests),
    };
  }

  // finance-only fields
  apiInput.financeIsChief = formValues.financeIsChief;
  apiInput.financeAdditionalDuties = formValues.financeAdditionalDuties
    ? stringArrayToEnumsFinanceChiefDuty(formValues.financeAdditionalDuties)
    : null;
  apiInput.financeOtherRoles = formValues.financeOtherRoles
    ? stringArrayToEnumsFinanceChiefRole(formValues.financeOtherRoles)
    : null;
  apiInput.financeOtherRolesOther = formValues.financeOtherRolesOther;

  apiInput.consentToShareProfile = formValues.consent;

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
          developmentProgramId: input.developmentProgramId,
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
          userDevPro.developmentProgram.id === developmentProgram.id,
      );
      return {
        developmentProgramId: developmentProgram.id,
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
