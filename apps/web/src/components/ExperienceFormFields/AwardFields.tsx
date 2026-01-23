import { useIntl } from "react-intl";
import { useQuery } from "urql";

import {
  DateInput,
  Input,
  Select,
  DATE_SEGMENT,
  localizedEnumToOptions,
  TextArea,
} from "@gc-digital-talent/forms";
import {
  errorMessages,
  uiMessages,
  sortAwardedScope,
  sortAwardedTo,
  getLocale,
  Locales,
} from "@gc-digital-talent/i18n";
import { strToFormDate } from "@gc-digital-talent/date-helpers";
import { graphql } from "@gc-digital-talent/graphql";
import { Heading } from "@gc-digital-talent/ui";

import { SubExperienceFormProps } from "~/types/experience";
import { getExperienceFormLabels } from "~/utils/experienceUtils";
import { FRENCH_WORDS_PER_ENGLISH_WORD } from "~/constants/talentSearchConstants";

const AwardOptions_Query = graphql(/* GraphQL */ `
  query AwardOptions {
    awardedTo: localizedEnumStrings(enumName: "AwardedTo") {
      value
      label {
        en
        fr
      }
    }
    awardedScopes: localizedEnumStrings(enumName: "AwardedScope") {
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

const AwardFields = ({
  labels,
  organizationSuggestions,
}: SubExperienceFormProps & { organizationSuggestions: string[] }) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const experienceLabels = getExperienceFormLabels(intl);
  const todayDate = new Date();
  const [{ data }] = useQuery({ query: AwardOptions_Query });

  const wordCountLimits: Record<Locales, number> = {
    en: TEXT_AREA_MAX_WORDS_EN,
    fr: Math.round(TEXT_AREA_MAX_WORDS_EN * FRENCH_WORDS_PER_ENGLISH_WORD),
  } as const;

  return (
    <>
      <div className="grid gap-6 xs:grid-cols-2">
        <div className="self-end">
          <Input
            id="awardTitle"
            label={labels.awardTitle}
            name="awardTitle"
            type="text"
            rules={{ required: intl.formatMessage(errorMessages.required) }}
          />
        </div>
        <div>
          <Select
            id="awardedTo"
            label={labels.awardedTo}
            name="awardedTo"
            nullSelection={intl.formatMessage(uiMessages.nullSelectionOption)}
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
            options={localizedEnumToOptions(
              sortAwardedTo(data?.awardedTo),
              intl,
            )}
          />
        </div>
        <div>
          <Input
            id="issuedBy"
            label={labels.issuedBy}
            name="issuedBy"
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
            id="awardedScope"
            label={labels.awardedScope}
            name="awardedScope"
            nullSelection={intl.formatMessage(uiMessages.nullSelectionOption)}
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
            options={localizedEnumToOptions(
              sortAwardedScope(data?.awardedScopes),
              intl,
            )}
          />
        </div>
        <div className="xs:col-span-2">
          <DateInput
            id="awardedDate"
            legend={labels.awardedDate}
            name="awardedDate"
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

export default AwardFields;
