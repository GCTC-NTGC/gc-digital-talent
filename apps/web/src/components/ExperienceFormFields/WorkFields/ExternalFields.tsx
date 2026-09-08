import { useIntl } from "react-intl";
import { useQuery } from "urql";

import {
  Input,
  localizedEnumToOptions,
  RadioGroup,
} from "@gc-digital-talent/forms";
import { errorMessages, commonMessages } from "@gc-digital-talent/i18n";
import type { ExternalWorkFieldOptionsQuery } from "@gc-digital-talent/graphql";
import { graphql } from "@gc-digital-talent/graphql";
import { Loading } from "@gc-digital-talent/ui";

import type { SubExperienceFormProps } from "~/types/experience";

import SupervisoryFields from "./SupervisoryFields";

const ExternalWorkFieldOptions_Query = graphql(/* GraphQL */ `
  query ExternalWorkFieldOptions {
    extSizeOfOrganizations: localizedEnumStrings(
      enumName: "ExternalSizeOfOrganization"
    ) {
      value
      label {
        localized
      }
    }
    extRoleSeniorities: localizedEnumStrings(
      enumName: "ExternalRoleSeniority"
    ) {
      value
      label {
        localized
      }
    }
  }
`);

const ExternalFields = ({
  labels,
  organizationSuggestions,
}: SubExperienceFormProps & { organizationSuggestions: string[] }) => {
  const intl = useIntl();
  const [{ data, fetching }] = useQuery<ExternalWorkFieldOptionsQuery>({
    query: ExternalWorkFieldOptions_Query,
  });

  return (
    <>
      {fetching ? (
        <Loading inline />
      ) : (
        <>
          <Input
            id="organization"
            label={labels.organization}
            placeholder={intl.formatMessage(commonMessages.selectOrTypeAnswer)}
            name="organization"
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
          <Input
            id="team"
            label={labels.team}
            name="team"
            type="text"
            rules={{ required: intl.formatMessage(errorMessages.required) }}
          />
          <RadioGroup
            idPrefix="extSizeOfOrganization"
            name="extSizeOfOrganization"
            legend={labels.extSizeOfOrganization}
            items={localizedEnumToOptions(data?.extSizeOfOrganizations, intl)}
            rules={{ required: intl.formatMessage(errorMessages.required) }}
          />
          <RadioGroup
            idPrefix="extRoleSeniority"
            name="extRoleSeniority"
            legend={labels.extRoleSeniority}
            items={localizedEnumToOptions(data?.extRoleSeniorities, intl)}
            rules={{ required: intl.formatMessage(errorMessages.required) }}
          />
          <SupervisoryFields labels={labels} />
        </>
      )}
    </>
  );
};

export default ExternalFields;
