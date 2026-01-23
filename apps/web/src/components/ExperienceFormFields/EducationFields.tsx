import { useIntl } from "react-intl";
import { useWatch } from "react-hook-form";
import { useQuery } from "urql";

import {
  Checkbox,
  DATE_SEGMENT,
  DateInput,
  Input,
  Select,
  TextArea,
  localizedEnumToOptions,
} from "@gc-digital-talent/forms";
import {
  errorMessages,
  uiMessages,
  sortEducationStatus,
  sortEducationType,
  getLocale,
  Locales,
} from "@gc-digital-talent/i18n";
import { strToFormDate } from "@gc-digital-talent/date-helpers";
import { graphql } from "@gc-digital-talent/graphql";
import { nodeToString } from "@gc-digital-talent/helpers";
import { Heading } from "@gc-digital-talent/ui";

import {
  SubExperienceFormProps,
  EducationFormValues,
} from "~/types/experience";
import { getExperienceFormLabels } from "~/utils/experienceUtils";
import { FRENCH_WORDS_PER_ENGLISH_WORD } from "~/constants/talentSearchConstants";

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

const TEXT_AREA_ROWS = 3;
const TEXT_AREA_MAX_WORDS_EN = 200;

const EducationFields = ({
  labels,
  organizationSuggestions,
}: SubExperienceFormProps & { organizationSuggestions: string[] }) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const experienceLabels = getExperienceFormLabels(intl);
  const todayDate = new Date();
  const [{ data }] = useQuery({ query: EducationOptions_Query });
  // to toggle whether End date is required, the state of the Current role checkbox must be monitored and have to adjust the form accordingly
  const isCurrent = useWatch<EducationFormValues>({ name: "currentRole" });
  // ensuring end date isn't before the start date, using this as a minimum value
  const watchStartDate = useWatch<EducationFormValues>({ name: "startDate" });

  const wordCountLimits: Record<Locales, number> = {
    en: TEXT_AREA_MAX_WORDS_EN,
    fr: Math.round(TEXT_AREA_MAX_WORDS_EN * FRENCH_WORDS_PER_ENGLISH_WORD),
  } as const;

  return (
    <>
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
                        value: watchStartDate ? String(watchStartDate) : "",
                        message: intl.formatMessage(
                          errorMessages.minDateLabel,
                          {
                            label: nodeToString(labels.startDate).toLowerCase(),
                          },
                        ),
                      },
                    }
              }
            />
          )}
        </div>
      </div>
      <Heading level="h3" size="h4" className="mt-18 mb-6 font-bold">
        {intl.formatMessage({
          defaultMessage: "Highlight additional details",
          id: "6v+j79",
          description: "Title for additional details section",
        })}
      </Heading>
      <div>
        <p className="mb-6">
          {intl.formatMessage({
            defaultMessage:
              "Describe <strong>key tasks</strong>, <strong>responsibilities</strong>, or <strong>other information</strong> you feel were crucial in making this experience important. Try to keep this field concise as you'll be able to provide more detailed information when linking skills to this experience.",
            id: "yZ0kfQ",
            description:
              "Help text for the experience additional details field",
          })}
        </p>
        <TextArea
          id={"details"}
          name={"details"}
          rows={TEXT_AREA_ROWS}
          wordLimit={wordCountLimits[locale]}
          label={experienceLabels.details}
          rules={{ required: intl.formatMessage(errorMessages.required) }}
        />
      </div>
    </>
  );
};

export default EducationFields;
