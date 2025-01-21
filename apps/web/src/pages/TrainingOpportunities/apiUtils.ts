import {
  CourseFormat,
  CourseLanguage,
  CreateTrainingOpportunityInput,
  graphql,
  TrainingOpportunityViewFragment,
  UpdateTrainingOpportunityInput,
} from "@gc-digital-talent/graphql";

export const TrainingOpportunityForm_Fragment = graphql(/* GraphQL */ `
  fragment TrainingOpportunityView on TrainingOpportunity {
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
  applicationDeadline: string;
  trainingStartDate: string;
  trainingEndDate: string;
  descriptionEn: string;
  descriptionFr: string;
  applicationUrlEn: string;
  applicationUrlFr: string;
}

export function convertApiFragmentToFormValues(
  apiData: TrainingOpportunityViewFragment,
): FormValues {
  return {
    titleEn: apiData.title?.en ?? "",
    titleFr: apiData.title?.fr ?? "",
    courseLanguage: apiData.courseLanguage?.value ?? "",
    courseFormat: apiData.courseFormat?.value ?? "",
    applicationDeadline: apiData.registrationDeadline ?? "",
    trainingStartDate: apiData.trainingStart ?? "",
    trainingEndDate: apiData.trainingEnd ?? "",
    descriptionEn: apiData.description?.en ?? "",
    descriptionFr: apiData.description?.fr ?? "",
    applicationUrlEn: apiData.applicationUrl?.en ?? "",
    applicationUrlFr: apiData.applicationUrl?.fr ?? "",
  };
}

export function convertFormValuesToCreateInput(
  formValues: FormValues,
): CreateTrainingOpportunityInput {
  return {
    title: {
      en: formValues.titleEn,
      fr: formValues.titleFr,
    },
    courseLanguage: formValues.courseLanguage as CourseLanguage,
    courseFormat: formValues.courseFormat as CourseFormat,
    registrationDeadline: formValues.applicationDeadline,
    trainingStart: formValues.trainingStartDate,
    trainingEnd: formValues.trainingEndDate,
    description: {
      en: formValues.descriptionEn,
      fr: formValues.descriptionFr,
    },
    applicationUrl: {
      en: formValues.applicationUrlEn,
      fr: formValues.applicationUrlFr,
    },
  };
}

export function convertFormValuesToUpdateInput(
  id: string,
  formValues: FormValues,
): UpdateTrainingOpportunityInput {
  const createInput = convertFormValuesToCreateInput(formValues);
  return {
    id: id,
    // input is the same as the one for "create" but also includes ID
    ...createInput,
  };
}
