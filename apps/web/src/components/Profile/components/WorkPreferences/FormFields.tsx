import { useIntl } from "react-intl";
import { useQuery } from "urql";

import {
  Checklist,
  Field,
  Input,
  RadioGroup,
  Select,
  TextArea,
  localizedEnumToOptions,
} from "@gc-digital-talent/forms";
import {
  OperationalRequirements,
  errorMessages,
  getOperationalRequirement,
  sortWorkRegion,
} from "@gc-digital-talent/i18n";
import { graphql } from "@gc-digital-talent/graphql";

import { FormFieldProps } from "../../types";
import useDirtyFields from "../../hooks/useDirtyFields";

const WorkPreferencesOptions_Query = graphql(/* GraphQL */ `
  query WorkPreferencesOptions {
    workRegions: localizedEnumStrings(enumName: "WorkRegion") {
      value
      label {
        en
        fr
      }
    }
    provinceOrTerritories: localizedEnumStrings(
      enumName: "ProvinceOrTerritory"
    ) {
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
      <RadioGroup
        idPrefix="required-work-preferences"
        legend={labels.contractDuration}
        name="wouldAcceptTemporary"
        id="wouldAcceptTemporary"
        data-h2-margin-bottom="base(x1)"
        rules={{
          required: intl.formatMessage(errorMessages.required),
        }}
        items={[
          {
            value: "true",
            label: intl.formatMessage({
              defaultMessage:
                "Any duration (short term, long term, indeterminate)",
              id: "ohQoWa",
              description:
                "Label displayed on Work Preferences form for any duration option",
            }),
          },
          {
            value: "false",
            label: intl.formatMessage({
              defaultMessage: "Indeterminate (permanent only)",
              id: "aB5p3B",
              description:
                "Label displayed on Work Preferences form for indeterminate duration option.",
            }),
          },
        ]}
      />
      <Checklist
        idPrefix="optional-work-preferences"
        legend={labels.acceptedOperationalRequirements}
        name="acceptedOperationalRequirements"
        id="acceptedOperationalRequirements"
        data-h2-margin-bottom="base(x1)"
        items={OperationalRequirements.map((value) => ({
          value,
          label: intl.formatMessage(
            getOperationalRequirement(value, "firstPerson"),
          ),
        }))}
      />
      <Field.Fieldset>
        <Field.Legend
          data-h2-font-size="base(h6)"
          data-h2-font-weight="base(700)"
          data-h2-margin-bottom="base(x1)"
        >
          {labels.currentLocation}
        </Field.Legend>
        <Input
          id="currentCity"
          name="currentCity"
          type="text"
          data-h2-margin-bottom="base(x1)"
          label={labels.currentCity}
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
        />
        <Select
          id="currentProvince"
          name="currentProvince"
          data-h2-margin-bottom="base(x1)"
          label={labels.currentProvince}
          nullSelection={intl.formatMessage({
            defaultMessage: "Select a province or territory",
            id: "H1wLfA",
            description:
              "Placeholder displayed on the About Me form province or territory field.",
          })}
          options={localizedEnumToOptions(data?.provinceOrTerritories, intl)}
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
        />
      </Field.Fieldset>
      <Field.Fieldset>
        <Field.Legend
          data-h2-font-size="base(h6)"
          data-h2-font-weight="base(700)"
          data-h2-margin-bottom="base(x1)"
        >
          {labels.workLocationPreferences}
        </Field.Legend>
        <Checklist
          idPrefix="work-location"
          legend={labels.locationPreferences}
          name="locationPreferences"
          id="locationPreferences"
          data-h2-margin-bottom="base(x1)"
          items={localizedEnumToOptions(
            sortWorkRegion(data?.workRegions),
            intl,
          )}
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
        />
        <TextArea
          id="location-exemptions"
          label={labels.locationExemptions}
          name="locationExemptions"
          aria-describedby="location-exemption-description"
        />
      </Field.Fieldset>
    </>
  );
};

export default FormFields;
