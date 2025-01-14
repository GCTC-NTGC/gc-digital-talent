import { useIntl } from "react-intl";
import { useWatch } from "react-hook-form";
import { useQuery } from "urql";

import {
  Checkbox,
  DATE_SEGMENT,
  DateInput,
  Input,
  localizedEnumToOptions,
  RadioGroup,
} from "@gc-digital-talent/forms";
import { errorMessages } from "@gc-digital-talent/i18n";
import { strToFormDate } from "@gc-digital-talent/date-helpers";
import {
  ExternalWorkFieldOptionsQuery,
  graphql,
} from "@gc-digital-talent/graphql";
import { Loading } from "@gc-digital-talent/ui";

import { SubExperienceFormProps, WorkFormValues } from "~/types/experience";

const ExternalWorkFieldOptions_Query = graphql(/* GraphQL */ `
  query ExternalWorkFieldOptions {
    extSizeOfOrganizations: localizedEnumStrings(
      enumName: "ExternalSizeOfOrganization"
    ) {
      value
      label {
        en
        fr
      }
    }
    extRoleSeniorities: localizedEnumStrings(
      enumName: "ExternalRoleSeniority"
    ) {
      value
      label {
        en
        fr
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

  const todayDate = new Date();
  // to toggle whether End date is required, the state of the Current role checkbox must be monitored and have to adjust the form accordingly
  const watchCurrentRole = useWatch<WorkFormValues>({ name: "currentRole" });
  // ensuring end date isn't before the start date, using this as a minimum value
  const watchStartDate = useWatch<WorkFormValues>({ name: "startDate" });
  return (
    <>
      {fetching ? (
        <div data-h2-flex-item="base(1of1)">
          <Loading inline />
        </div>
      ) : (
        <>
          <div data-h2-flex-item="base(1of1)">
            <Input
              id="organization"
              label={labels.organization}
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
          </div>
          <div data-h2-flex-item="base(1of1)">
            <Input
              id="team"
              label={labels.team}
              name="team"
              type="text"
              rules={{ required: intl.formatMessage(errorMessages.required) }}
            />
          </div>
          <div data-h2-flex-item="base(1of1)">
            <RadioGroup
              idPrefix="extSizeOfOrganization"
              name="extSizeOfOrganization"
              legend={labels.extSizeOfOrganization}
              items={localizedEnumToOptions(data?.extSizeOfOrganizations, intl)}
              rules={{ required: intl.formatMessage(errorMessages.required) }}
            />
          </div>
          <div data-h2-flex-item="base(1of1)">
            <RadioGroup
              idPrefix="extRoleSeniority"
              name="extRoleSeniority"
              legend={labels.extRoleSeniority}
              items={localizedEnumToOptions(data?.extRoleSeniorities, intl)}
              rules={{ required: intl.formatMessage(errorMessages.required) }}
            />
          </div>
          <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
            <DateInput
              id="startDate"
              legend={labels.startDate}
              name="startDate"
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
          <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
            <div data-h2-margin-top="p-tablet(x1)">
              <Checkbox
                boundingBox
                boundingBoxLabel={labels.currentRole}
                id="currentRole"
                label={intl.formatMessage({
                  defaultMessage: "I am currently active in this role",
                  id: "mOx5K1",
                  description: "Label displayed for current role input",
                })}
                name="currentRole"
              />
            </div>
          </div>
          <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
            {/* conditionally render the end-date based off the state attached to the checkbox input */}
            {!watchCurrentRole && (
              <DateInput
                id="endDate"
                legend={labels.endDate}
                name="endDate"
                show={[DATE_SEGMENT.Month, DATE_SEGMENT.Year]}
                rules={
                  watchCurrentRole
                    ? {}
                    : {
                        required: intl.formatMessage(errorMessages.required),
                        min: {
                          value: watchStartDate ? String(watchStartDate) : "",
                          message: intl.formatMessage(errorMessages.futureDate),
                        },
                      }
                }
              />
            )}
          </div>
        </>
      )}
    </>
  );
};

export default ExternalFields;
