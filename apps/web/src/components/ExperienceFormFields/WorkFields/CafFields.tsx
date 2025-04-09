import { useIntl } from "react-intl";
import { useWatch } from "react-hook-form";
import { useQuery } from "urql";

import {
  Checkbox,
  DATE_SEGMENT,
  DateInput,
  localizedEnumToOptions,
  RadioGroup,
} from "@gc-digital-talent/forms";
import { errorMessages } from "@gc-digital-talent/i18n";
import { strToFormDate } from "@gc-digital-talent/date-helpers";
import { CafFieldsOptionsQuery, graphql } from "@gc-digital-talent/graphql";
import { Loading } from "@gc-digital-talent/ui";

import { SubExperienceFormProps, WorkFormValues } from "~/types/experience";

const CafFieldsOptions_Query = graphql(/* GraphQL */ `
  query CafFieldsOptions {
    cafEmploymentTypes: localizedEnumStrings(enumName: "CafEmploymentType") {
      value
      label {
        en
        fr
      }
    }
    cafForces: localizedEnumStrings(enumName: "CafForce") {
      value
      label {
        en
        fr
      }
    }
    cafRanks: localizedEnumStrings(enumName: "CafRank") {
      value
      label {
        en
        fr
      }
    }
  }
`);

const CafFields = ({ labels }: SubExperienceFormProps) => {
  const intl = useIntl();
  const [{ data, fetching }] = useQuery<CafFieldsOptionsQuery>({
    query: CafFieldsOptions_Query,
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
            <RadioGroup
              idPrefix="cafEmploymentType"
              name="cafEmploymentType"
              legend={labels.cafEmploymentType}
              items={localizedEnumToOptions(data?.cafEmploymentTypes, intl)}
              rules={{ required: intl.formatMessage(errorMessages.required) }}
            />
          </div>
          <div data-h2-flex-item="base(1of1)">
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
          </div>
          <div data-h2-flex-item="base(1of1)">
            <RadioGroup
              idPrefix="cafRank"
              name="cafRank"
              legend={labels.cafRank}
              items={localizedEnumToOptions(data?.cafRanks, intl)}
              rules={{ required: intl.formatMessage(errorMessages.required) }}
            />
          </div>
          <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
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
                round="ceil"
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

export default CafFields;
