import { useIntl } from "react-intl";
import { useQuery } from "urql";

import {
  DateInput,
  Input,
  Select,
  DATE_SEGMENT,
  localizedEnumToOptions,
} from "@gc-digital-talent/forms";
import {
  errorMessages,
  uiMessages,
  sortAwardedScope,
  sortAwardedTo,
} from "@gc-digital-talent/i18n";
import { strToFormDate } from "@gc-digital-talent/date-helpers";
import { graphql } from "@gc-digital-talent/graphql";

import { SubExperienceFormProps } from "~/types/experience";

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

const AwardFields = ({
  labels,
  organizationSuggestions,
}: SubExperienceFormProps & { organizationSuggestions: string[] }) => {
  const intl = useIntl();
  const todayDate = new Date();
  const [{ data }] = useQuery({ query: AwardOptions_Query });

  return (
    <div data-h2-margin="base(x.5, 0, 0, 0)" data-h2-max-width="base(50rem)">
      <div data-h2-flex-grid="base(flex-start, x2, x1)">
        <div
          data-h2-flex-item="base(1of1) p-tablet(1of2)"
          data-h2-align-self="base(flex-end)"
        >
          <Input
            id="awardTitle"
            label={labels.awardTitle}
            name="awardTitle"
            type="text"
            rules={{ required: intl.formatMessage(errorMessages.required) }}
          />
        </div>
        <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
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
        <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
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
        <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
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
        <div data-h2-flex-item="base(1of1)">
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
    </div>
  );
};

export default AwardFields;
