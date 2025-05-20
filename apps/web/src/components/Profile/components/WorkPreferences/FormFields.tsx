import { useIntl } from "react-intl";

import {
  OperationalRequirements,
  errorMessages,
  getOperationalRequirement,
  sortWorkRegion,
} from "@gc-digital-talent/i18n";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import Checklist from "@gc-digital-talent/forms/Checklist";
import Field from "@gc-digital-talent/forms/Field";
import RadioGroup from "@gc-digital-talent/forms/RadioGroup";
import Select from "@gc-digital-talent/forms/Select";
import { localizedEnumToOptions } from "@gc-digital-talent/forms/utils";
import Input from "@gc-digital-talent/forms/Input";
import TextArea from "@gc-digital-talent/forms/TextArea";

import useDirtyFields from "../../hooks/useDirtyFields";
import { FormFieldProps } from "../../types";

const WorkPreferencesFormOptions_Fragment = graphql(/* GraphQL */ `
  fragment WorkPreferencesFormOptions on Query {
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

const FormFields = ({
  labels,
  optionsQuery,
}: FormFieldProps<
  FragmentType<typeof WorkPreferencesFormOptions_Fragment>
>) => {
  const intl = useIntl();
  const data = getFragment(WorkPreferencesFormOptions_Fragment, optionsQuery);
  useDirtyFields("work");

  return (
    <div
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(column)"
      data-h2-row-gap="base(x1)"
    >
      <RadioGroup
        idPrefix="required-work-preferences"
        legend={labels.contractDuration}
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
        items={OperationalRequirements.map((value) => ({
          value,
          label: intl.formatMessage(
            getOperationalRequirement(value, "firstPerson"),
          ),
        }))}
      />
      <Field.Fieldset
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column)"
        data-h2-gap="base(x1)"
      >
        <Field.Legend
          data-h2-font-size="base(h6)"
          data-h2-font-weight="base(700)"
          data-h2-margin-bottom="base(x1)"
        >
          {labels.currentLocation}
        </Field.Legend>
        <Select
          id="currentProvince"
          name="currentProvince"
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
        <Input
          id="currentCity"
          name="currentCity"
          type="text"
          label={labels.currentCity}
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
        />
      </Field.Fieldset>
      <Field.Fieldset
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column)"
        data-h2-gap="base(x1)"
      >
        <Field.Legend
          data-h2-font-size="base(h6)"
          data-h2-font-weight="base(700)"
          data-h2-margin-bottom="base(x1)"
        >
          {labels.workLocationPreferences}
        </Field.Legend>
        <Checklist
          idPrefix="work-location"
          legend={labels.workLocationPreferences}
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
        <TextArea
          id="location-exemptions"
          label={labels.locationExemptions}
          name="locationExemptions"
          aria-describedby="location-exemption-description"
        />
      </Field.Fieldset>
    </div>
  );
};

export default FormFields;
