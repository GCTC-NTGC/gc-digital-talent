import { useIntl } from "react-intl";
import { useWatch } from "react-hook-form";

import {
  Checkbox,
  DATE_SEGMENT,
  DateInput,
  Input,
  localizedEnumToOptions,
  RichTextInput,
  Select,
} from "@gc-digital-talent/forms";
import { commonMessages, errorMessages } from "@gc-digital-talent/i18n";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { currentDate } from "@gc-digital-talent/date-helpers";

import formLabels from "../formLabels";
import { FormValues } from "../apiUtils";

export const TrainingOpportunityFormOptions_Fragment = graphql(/* GraphQL */ `
  fragment TrainingOpportunityFormOptions on Query {
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

interface TrainingOpportunityFormProps {
  query: FragmentType<typeof TrainingOpportunityFormOptions_Fragment>;
}

const TrainingOpportunityForm = ({ query }: TrainingOpportunityFormProps) => {
  const intl = useIntl();
  const { courseLanguages, courseFormats } = getFragment(
    TrainingOpportunityFormOptions_Fragment,
    query,
  );
  const startDate = useWatch<FormValues>({ name: "trainingStartDate" });
  return (
    <div className="grid items-end gap-6 xs:grid-cols-2">
      <Input
        id="titleEn"
        name="titleEn"
        label={intl.formatMessage(commonMessages.title)}
        appendLanguageToLabel={"en"}
        type="text"
        rules={{
          required: intl.formatMessage(errorMessages.required),
        }}
      />
      <Input
        id="titleFr"
        name="titleFr"
        label={intl.formatMessage(commonMessages.title)}
        appendLanguageToLabel={"fr"}
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
        id="applicationDeadline"
        legend={intl.formatMessage(formLabels.applicationDeadline)}
        name="applicationDeadline"
        show={[DATE_SEGMENT.Day, DATE_SEGMENT.Month, DATE_SEGMENT.Year]}
        rules={{
          required: intl.formatMessage(errorMessages.required),
        }}
      />
      <Checkbox
        name="pinned"
        id="pinned"
        boundingBox
        boundingBoxLabel={intl.formatMessage(formLabels.pinned)}
        label={intl.formatMessage({
          defaultMessage: "Pin to top of training opportunities",
          id: "yKDTtM",
          description: "Label to pin an opportunity to the top of the list",
        })}
      />
      <DateInput
        id="trainingStartDate"
        legend={intl.formatMessage(formLabels.trainingStartDate)}
        name="trainingStartDate"
        show={[DATE_SEGMENT.Day, DATE_SEGMENT.Month, DATE_SEGMENT.Year]}
        rules={{
          required: intl.formatMessage(errorMessages.required),
          min: {
            value: currentDate(),
            message: intl.formatMessage(errorMessages.futureDate),
          },
        }}
      />
      <DateInput
        id="trainingEndDate"
        legend={intl.formatMessage(formLabels.trainingEndDate)}
        name="trainingEndDate"
        show={[DATE_SEGMENT.Day, DATE_SEGMENT.Month, DATE_SEGMENT.Year]}
        rules={{
          min: {
            value: String(startDate),
            message: String(
              intl.formatMessage(errorMessages.mustBeGreater, {
                value: startDate,
              }),
            ),
          },
        }}
      />
      <RichTextInput
        id="descriptionEn"
        label={intl.formatMessage(commonMessages.description)}
        appendLanguageToLabel={"en"}
        name="descriptionEn"
        allowHeadings
        rules={{
          required: intl.formatMessage(errorMessages.required),
        }}
      />
      <RichTextInput
        id="descriptionFr"
        label={intl.formatMessage(commonMessages.description)}
        appendLanguageToLabel={"fr"}
        name="descriptionFr"
        allowHeadings
        rules={{
          required: intl.formatMessage(errorMessages.required),
        }}
      />
      <Input
        id="applicationUrlEn"
        name="applicationUrlEn"
        label={intl.formatMessage(formLabels.applicationUrl)}
        appendLanguageToLabel={"en"}
        type="url"
        rules={{
          required: intl.formatMessage(errorMessages.required),
        }}
      />
      <Input
        id="applicationUrlFr"
        name="applicationUrlFr"
        label={intl.formatMessage(formLabels.applicationUrl)}
        appendLanguageToLabel={"fr"}
        type="url"
        rules={{
          required: intl.formatMessage(errorMessages.required),
        }}
      />
    </div>
  );
};

export default TrainingOpportunityForm;
