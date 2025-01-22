import {
  CreateCommunityInterestInput,
  CreateDevelopmentProgramInterestInput,
  DevelopmentProgramParticipationStatus,
} from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import { FormValues } from "./CreateCommunityInterestPage";

function parseStringToBoolean(value: string | null): boolean | null {
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
    formValues.interestInWorkStreamIds !== undefined &&
    Array.isArray(formValues.interestInWorkStreamIds)
  ) {
    apiInput.workStreams = {
      sync: formValues.interestInWorkStreamIds,
    };
  }

  if (formValues.jobInterest !== undefined) {
    apiInput.jobInterest = parseStringToBoolean(formValues.jobInterest);
  }

  if (formValues.trainingInterest !== undefined) {
    apiInput.trainingInterest = parseStringToBoolean(
      formValues.trainingInterest,
    );
  }

  if (formValues.additionalInformation !== undefined) {
    apiInput.additionalInformation = formValues.additionalInformation;
  }

  if (formValues.interestInDevelopmentPrograms !== undefined) {
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
