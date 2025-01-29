import {
  CreateCommunityInterestInput,
  CreateDevelopmentProgramInterestInput,
  DevelopmentProgramParticipationStatus,
  UpdateCommunityInterestForm_FragmentFragment,
} from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import { SubformValues as FindANewCommunitySubformValues } from "./sections/FindANewCommunity";
import { SubformValues as TrainingAndDevelopmentOpportunitiesSubformValues } from "./sections/TrainingAndDevelopmentOpportunities";
import { SubformValues as AdditionalInformationSubformValues } from "./sections/AdditionalInformation";
import { SubformValues as ReviewAndSubmitSubformValues } from "./sections/ReviewAndSubmit";

export interface FormValues
  extends FindANewCommunitySubformValues,
    TrainingAndDevelopmentOpportunitiesSubformValues,
    AdditionalInformationSubformValues,
    ReviewAndSubmitSubformValues {
  userId: string | null;
}

export function parseStringToBoolean(value: string | null): boolean | null {
  if (value?.toLocaleLowerCase() === "true") {
    return true;
  }
  if (value?.toLocaleLowerCase() === "false") {
    return false;
  }
  if (value === null) {
    return null;
  }
  throw new Error(`Invalid boolean value: (${value})`);
}

export function formValuesToApiInput(
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
    apiInput.jobInterest = parseStringToBoolean(formValues.jobInterest);
  }

  if (formValues.trainingInterest !== null) {
    apiInput.trainingInterest = parseStringToBoolean(
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
              participationStatus:
                interest.participationStatus as DevelopmentProgramParticipationStatus,
              completionDate: interest.completionDate,
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

  return apiInput;
}

export function apiDataToFormValues(
  userId: string | null | undefined,
  communityInterest:
    | UpdateCommunityInterestForm_FragmentFragment
    | null
    | undefined,
): FormValues {
  return {
    userId: userId ?? null,
    communityId: communityInterest?.community.id ?? null,
    interestInWorkStreamIds:
      communityInterest?.workStreams?.map((ws) => ws.id) ?? [],
    jobInterest: communityInterest?.jobInterest?.toString() ?? null,
    trainingInterest: communityInterest?.trainingInterest?.toString() ?? null,
    additionalInformation: communityInterest?.additionalInformation ?? null,
    interestInDevelopmentPrograms:
      communityInterest?.interestInDevelopmentPrograms?.map((interest) => ({
        developmentProgramId: interest.developmentProgram.id,
        participationStatus: interest.participationStatus ?? null,
        completionDate: interest.completionDate ?? null,
      })) ?? [],
    consent: null, // not saved in the database
  };
}
