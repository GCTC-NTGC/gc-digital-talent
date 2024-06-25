import { useIntl } from "react-intl";
import { useQuery } from "urql";

import {
  Checklist,
  RadioGroup,
  TextArea,
  localizedEnumToOptions,
} from "@gc-digital-talent/forms";
import {
  OperationalRequirements,
  errorMessages,
  getOperationalRequirement,
} from "@gc-digital-talent/i18n";
import { graphql } from "@gc-digital-talent/graphql";

import { FormFieldProps } from "../../types";
import useDirtyFields from "../../hooks/useDirtyFields";
import { sortWorkRegion } from "../../../../utils/localizedEnumUtils";

const WorkPreferencesOptions_Query = graphql(/* GraphQL */ `
  query WorkPreferencesOptions {
    workRegions: localizedEnumStrings(enumName: "WorkRegion") {
      value
      label {
        en
        fr
      }
    }
  }
`);

const FormFields = ({ labels }: FormFieldProps) => {
  const intl = useIntl();
  const [{ data }] = useQuery({ query: WorkPreferencesOptions_Query });
  useDirtyFields("work");

  return (
    <>
      <div data-h2-padding-top="base(x1)">
        <RadioGroup
          idPrefix="required-work-preferences"
          legend={labels.wouldAcceptTemporary}
          name="wouldAcceptTemporary"
          id="wouldAcceptTemporary"
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
          items={[
            {
              value: "true",
              label: intl.formatMessage({
                defaultMessage:
                  "any duration (short term, long term, indeterminate).",
                id: "YqWNkT",
                description:
                  "Label displayed on Work Preferences form for any duration option",
              }),
            },
            {
              value: "false",
              label: intl.formatMessage({
                defaultMessage: "indeterminate (permanent only).",
                id: "+YUDhx",
                description:
                  "Label displayed on Work Preferences form for indeterminate duration option.",
              }),
            },
          ]}
        />
      </div>
      <div data-h2-padding-top="base(x1)">
        <Checklist
          idPrefix="optional-work-preferences"
          legend={labels.acceptedOperationalRequirements}
          name="acceptedOperationalRequirements"
          id="acceptedOperationalRequirements"
          items={OperationalRequirements.map((value) => ({
            value,
            label: intl.formatMessage(
              getOperationalRequirement(value, "firstPerson"),
            ),
          }))}
        />
      </div>
      <div data-h2-padding-top="base(x1)">
        <Checklist
          idPrefix="work-location"
          legend={labels.locationPreferences}
          name="locationPreferences"
          id="locationPreferences"
          items={localizedEnumToOptions(
            sortWorkRegion(data?.workRegions),
            intl,
          )}
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
        />
      </div>
      <div data-h2-padding-top="base(x1)">
        <TextArea
          id="location-exemptions"
          label={labels.locationExemptions}
          name="locationExemptions"
          aria-describedby="location-exemption-description"
        />
      </div>
    </>
  );
};

export default FormFields;
