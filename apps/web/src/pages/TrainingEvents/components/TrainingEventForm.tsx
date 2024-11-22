import { useIntl } from "react-intl";

import {
  DATE_SEGMENT,
  DateInput,
  Input,
  localizedEnumToOptions,
  RichTextInput,
  Select,
} from "@gc-digital-talent/forms";
import { errorMessages } from "@gc-digital-talent/i18n";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";

import formLabels from "../formLabels";

export const TrainingEventFormOptions_Fragment = graphql(/* GraphQL */ `
  fragment TrainingEventFormOptions on Query {
    courseLanguages: localizedEnumStrings(enumName: "CourseLanguage") {
      value
      label {
        en
        fr
      }
    }
    courseFormats: localizedEnumStrings(enumName: "CourseFormat") {
      value
      label {
        en
        fr
      }
    }
  }
`);

interface TrainingEventFormProps {
  query: FragmentType<typeof TrainingEventFormOptions_Fragment>;
}

const TrainingEventForm = ({ query }: TrainingEventFormProps) => {
  const intl = useIntl();
  const { courseLanguages, courseFormats } = getFragment(
    TrainingEventFormOptions_Fragment,
    query,
  );
  return (
    <div
      data-h2-display="base(grid)"
      data-h2-grid-template-columns="p-tablet(repeat(2, 1fr))"
      data-h2-gap="base(x1)"
    >
      <Input
        id="titleEn"
        name="titleEn"
        label={intl.formatMessage(formLabels.titleEn)}
        type="text"
        rules={{
          required: intl.formatMessage(errorMessages.required),
        }}
      />
      <Input
        id="titleFr"
        name="titleFr"
        label={intl.formatMessage(formLabels.titleFr)}
        type="text"
        rules={{
          required: intl.formatMessage(errorMessages.required),
        }}
      />
      <Select
        id="courseLanguage"
        name="courseLanguage"
        label={intl.formatMessage(formLabels.courseLanguage)}
        nullSelection={intl.formatMessage({
          defaultMessage: "Select a language",
          id: "uup5F2",
          description:
            "Placeholder displayed on the user form preferred communication language field.",
        })}
        rules={{
          required: intl.formatMessage(errorMessages.required),
        }}
        options={localizedEnumToOptions(courseLanguages, intl)}
      />
      <Select
        id="courseFormat"
        name="courseFormat"
        label={intl.formatMessage(formLabels.format)}
        nullSelection={intl.formatMessage({
          defaultMessage: "Select a format",
          id: "m3c4o8",
          description: "Placeholder displayed on the select input for a format",
        })}
        rules={{
          required: intl.formatMessage(errorMessages.required),
        }}
        options={localizedEnumToOptions(courseFormats, intl)}
      />
      <DateInput
        id="registrationDeadline"
        legend={intl.formatMessage(formLabels.registrationDeadline)}
        name="registrationDeadline"
        show={[DATE_SEGMENT.Day, DATE_SEGMENT.Month, DATE_SEGMENT.Year]}
        rules={{
          required: intl.formatMessage(errorMessages.required),
        }}
      />
      <div data-h2-display="base(none) p-tablet(inherit)">
        {/* intentionally left blank */}
      </div>
      <DateInput
        id="trainingStart"
        legend={intl.formatMessage(formLabels.trainingStartDate)}
        name="trainingStart"
        show={[DATE_SEGMENT.Day, DATE_SEGMENT.Month, DATE_SEGMENT.Year]}
        rules={{
          required: intl.formatMessage(errorMessages.required),
        }}
      />
      <DateInput
        id="trainingEnd"
        legend={intl.formatMessage(formLabels.trainingEndDate)}
        name="trainingEnd"
        show={[DATE_SEGMENT.Day, DATE_SEGMENT.Month, DATE_SEGMENT.Year]}
      />
      <RichTextInput
        id="descriptionEn"
        label={intl.formatMessage(formLabels.descriptionEn)}
        name="descriptionEn"
        rules={{
          required: intl.formatMessage(errorMessages.required),
        }}
      />
      <RichTextInput
        id="descriptionFr"
        label={intl.formatMessage(formLabels.descriptionFr)}
        name="descriptionFr"
        rules={{
          required: intl.formatMessage(errorMessages.required),
        }}
      />
      <Input
        id="applicationUrlEn"
        name="applicationUrlEn"
        label={intl.formatMessage(formLabels.applicationUrlEn)}
        type="text"
        rules={{
          required: intl.formatMessage(errorMessages.required),
        }}
      />
      <Input
        id="applicationUrlFr"
        name="applicationUrlFr"
        label={intl.formatMessage(formLabels.applicationUrlFr)}
        type="text"
        rules={{
          required: intl.formatMessage(errorMessages.required),
        }}
      />
    </div>
  );
};

export default TrainingEventForm;
