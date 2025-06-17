import { useIntl } from "react-intl";
import { useWatch } from "react-hook-form";
import { useQuery } from "urql";

import {
  Checkbox,
  DATE_SEGMENT,
  DateInput,
  Input,
  Select,
  localizedEnumToOptions,
} from "@gc-digital-talent/forms";
import {
  errorMessages,
  uiMessages,
  sortEducationStatus,
  sortEducationType,
} from "@gc-digital-talent/i18n";
import { strToFormDate } from "@gc-digital-talent/date-helpers";
import { graphql } from "@gc-digital-talent/graphql";

import {
  SubExperienceFormProps,
  EducationFormValues,
} from "~/types/experience";

const EducationOptions_Query = graphql(/* GraphQL */ `
  query EducationOptions {
    educationTypes: localizedEnumStrings(enumName: "EducationType") {
      value
      label {
        en
        fr
      }
    }
    educationStatuses: localizedEnumStrings(enumName: "EducationStatus") {
      value
      label {
        en
        fr
      }
    }
  }
`);

const EducationFields = ({
  labels,
  organizationSuggestions,
}: SubExperienceFormProps & { organizationSuggestions: string[] }) => {
  const intl = useIntl();
  const todayDate = new Date();
  const [{ data }] = useQuery({ query: EducationOptions_Query });
  // to toggle whether End date is required, the state of the Current role checkbox must be monitored and have to adjust the form accordingly
  const isCurrent = useWatch<EducationFormValues>({ name: "currentRole" });
  // ensuring end date isn't before the start date, using this as a minimum value
  const watchStartDate = useWatch<EducationFormValues>({ name: "startDate" });

  return (
    <div className="grid gap-6 xs:grid-cols-2">
      <div>
        <Select
          id="educationType"
          label={labels.educationType}
          name="educationType"
          nullSelection={intl.formatMessage(uiMessages.nullSelectionOption)}
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
          options={localizedEnumToOptions(
            sortEducationType(data?.educationTypes),
            intl,
          )}
        />
      </div>
      <div>
        <Checkbox
          id="currentRole"
          boundingBox
          boundingBoxLabel={labels.currentRole}
          label={intl.formatMessage({
            defaultMessage: "I am currently active in this education",
            id: "491LrZ",
            description:
              "Label displayed on Education Experience form for current education input",
          })}
          name="currentRole"
        />
      </div>
      <div>
        <Input
          id="areaOfStudy"
          label={labels.areaOfStudy}
          name="areaOfStudy"
          type="text"
          rules={{ required: intl.formatMessage(errorMessages.required) }}
        />
      </div>
      <div>
        <Input
          id="institution"
          label={labels.institution}
          name="institution"
          type="text"
          rules={{ required: intl.formatMessage(errorMessages.required) }}
          list={
            organizationSuggestions.length
              ? "organizationSuggestions"
              : undefined
          }
        />
        {organizationSuggestions.length > 0 && (
          <datalist id="organizationSuggestions">
            {organizationSuggestions.map((suggestion) => {
              return <option key={suggestion} value={suggestion}></option>;
            })}
          </datalist>
        )}
      </div>
      <div>
        <Select
          id="educationStatus"
          label={labels.educationStatus}
          name="educationStatus"
          nullSelection={intl.formatMessage(uiMessages.nullSelectionOption)}
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
          options={localizedEnumToOptions(
            sortEducationStatus(data?.educationStatuses),
            intl,
          )}
        />
      </div>
      <div>
        <Input
          id="thesisTitle"
          label={labels.thesisTitle}
          name="thesisTitle"
          type="text"
        />
      </div>
      <div>
        <DateInput
          id="startDate"
          legend={labels.startDate}
          name="startDate"
          round="floor"
          show={[DATE_SEGMENT.Month, DATE_SEGMENT.Year]}
          rules={{
            required: intl.formatMessage(errorMessages.required),
            max: {
              value: strToFormDate(todayDate.toISOString()),
              message: intl.formatMessage(errorMessages.mustNotBeFuture),
            },
          }}
        />
      </div>
      <div>
        {!isCurrent && (
          <DateInput
            id="endDate"
            legend={labels.endDate}
            name="endDate"
            round="ceil"
            show={[DATE_SEGMENT.Month, DATE_SEGMENT.Year]}
            rules={
              isCurrent
                ? {}
                : {
                    required: intl.formatMessage(errorMessages.required),
                    min: {
                      value: String(watchStartDate),
                      message: String(
                        intl.formatMessage(errorMessages.dateMustFollow, {
                          value: watchStartDate,
                        }),
                      ),
                    },
                  }
            }
          />
        )}
      </div>
    </div>
  );
};

export default EducationFields;
