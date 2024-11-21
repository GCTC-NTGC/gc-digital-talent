import { graphql, TrainingEventViewFragment } from "@gc-digital-talent/graphql";

export const TrainingEventForm_Fragment = graphql(/* GraphQL */ `
  fragment TrainingEventView on TrainingOpportunity {
    title {
      en
      fr
    }
    courseLanguage {
      value
      label {
        en
        fr
      }
    }
    courseFormat {
      value
      label {
        en
        fr
      }
    }
    registrationDeadline
    trainingStart
    trainingEnd
    description {
      en
      fr
    }
    applicationUrl {
      en
      fr
    }
  }
`);

export interface FormValues {
  titleEn: string;
  titleFr: string;
  courseLanguage: string;
  courseFormat: string;
  registrationDeadline: string;
  trainingStart: string;
  trainingEnd: string;
  descriptionEn: string;
  descriptionFr: string;
  applicationUrlEn: string;
  applicationUrlFr: string;
}

export function convertApiFragmentToFormValues(
  apiData: TrainingEventViewFragment,
): FormValues {
  return {
    titleEn: apiData.title?.en ?? "",
    titleFr: apiData.title?.fr ?? "",
    courseLanguage: apiData.courseLanguage?.value ?? "",
    courseFormat: apiData.courseFormat?.value ?? "",
    registrationDeadline: apiData.registrationDeadline ?? "",
    trainingStart: apiData.trainingStart ?? "",
    trainingEnd: apiData.trainingEnd ?? "",
    descriptionEn: apiData.description?.en ?? "",
    descriptionFr: apiData.description?.fr ?? "",
    applicationUrlEn: apiData.applicationUrl?.en ?? "",
    applicationUrlFr: apiData.applicationUrl?.fr ?? "",
  };
}
