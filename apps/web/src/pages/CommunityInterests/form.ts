import {
  CreateCommunityInterestInput,
  CreateDevelopmentProgramInterestInput,
  DevelopmentProgramParticipationStatus,
  UpdateCommunityInterestFormData_FragmentFragment,
  UpdateCommunityInterestInput,
  UpdateDevelopmentProgramInterestHasMany,
} from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { strToFormDate } from "@gc-digital-talent/date-helpers";

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
  };
}

export function apiDataToFormValues(
  userId: string | null | undefined,
  communityInterest:
    | UpdateCommunityInterestFormData_FragmentFragment
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
      communityInterest?.interestInDevelopmentPrograms
        ?.sort((a, b) =>
          (a.developmentProgram.name?.localized ?? "").localeCompare(
            b.developmentProgram.name?.localized ?? "",
          ),
        )
        .map((interest) => ({
          developmentProgramId: interest.developmentProgram.id,
          participationStatus: interest.participationStatus ?? null,
          completionDate:
            typeof interest.completionDate === "string"
              ? strToFormDate(interest.completionDate)
              : null,
        })) ?? null,
    // not saved in the database but if job or training interest is saved, they will have previously consented
    consent:
      !!communityInterest?.jobInterest || !!communityInterest?.trainingInterest,
  };
}
