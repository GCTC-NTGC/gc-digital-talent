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
          options={localizedEnumToOptions(sortAwardedTo(data?.awardedTo), intl)}
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
  );
};

export default AwardFields;
