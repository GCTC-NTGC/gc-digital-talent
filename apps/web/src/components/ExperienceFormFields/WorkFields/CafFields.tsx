import { useIntl } from "react-intl";
import { useQuery } from "urql";

import { localizedEnumToOptions, RadioGroup } from "@gc-digital-talent/forms";
import { errorMessages } from "@gc-digital-talent/i18n";
import type { CafFieldsOptionsQuery } from "@gc-digital-talent/graphql";
import { graphql } from "@gc-digital-talent/graphql";
import { Loading } from "@gc-digital-talent/ui";

import type { SubExperienceFormProps } from "~/types/experience";

const CafFieldsOptions_Query = graphql(/* GraphQL */ `
  query CafFieldsOptions {
    cafEmploymentTypes: localizedEnumStrings(enumName: "CafEmploymentType") {
      value
      label {
        localized
      }
    }
    cafForces: localizedEnumStrings(enumName: "CafForce") {
      value
      label {
        localized
      }
    }
    cafRanks: localizedEnumStrings(enumName: "CafRank") {
      value
      label {
        localized
      }
    }
  }
`);

const CafFields = ({ labels }: SubExperienceFormProps) => {
  const intl = useIntl();
  const [{ data, fetching }] = useQuery<CafFieldsOptionsQuery>({
    query: CafFieldsOptions_Query,
  });

  return (
    <>
      {fetching ? (
        <Loading inline />
      ) : (
        <>
          <RadioGroup
            idPrefix="cafEmploymentType"
            name="cafEmploymentType"
            legend={labels.cafEmploymentType}
            items={localizedEnumToOptions(data?.cafEmploymentTypes, intl)}
            rules={{ required: intl.formatMessage(errorMessages.required) }}
          />
          <RadioGroup
            idPrefix="cafForce"
            name="cafForce"
            legend={intl.formatMessage({
              defaultMessage: "Military force",
              id: "kdXBAS",
              description: "Label for the military force radio group",
            })}
            items={localizedEnumToOptions(data?.cafForces, intl)}
            rules={{ required: intl.formatMessage(errorMessages.required) }}
          />
          <RadioGroup
            idPrefix="cafRank"
            name="cafRank"
            legend={labels.cafRank}
            items={localizedEnumToOptions(data?.cafRanks, intl)}
            rules={{ required: intl.formatMessage(errorMessages.required) }}
          />
        </>
      )}
    </>
  );
};

export default CafFields;
