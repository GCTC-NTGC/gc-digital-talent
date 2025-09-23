import { useIntl } from "react-intl";

import {
  CheckboxOption,
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
  sortFlexibleWorkLocations,
  sortWorkRegion,
} from "@gc-digital-talent/i18n";
import {
  FlexibleWorkLocation,
  FragmentType,
  getFragment,
  graphql,
  WorkRegion,
} from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import { FormFieldProps } from "../../types";
import useDirtyFields from "../../hooks/useDirtyFields";

export const WorkPreferencesFormOptions_Fragment = graphql(/* GraphQL */ `
  fragment WorkPreferencesFormOptions on Query {
    workRegions: localizedEnumStrings(enumName: "WorkRegion") {
      value
      label {
        en
        fr
        localized
      }
    }
    flexibleWorkLocation: localizedEnumStrings(
      enumName: "FlexibleWorkLocation"
    ) {
      value
      label {
        en
        fr
        localized
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

  // taking the enum collection from the API request
  // turn them into options, append a content-below node
  const formOptionsWithContentBelow: CheckboxOption[] =
    sortFlexibleWorkLocations(data?.flexibleWorkLocation).map((loc) => {
      if (loc.value === (FlexibleWorkLocation.Remote as string)) {
        return {
          value: loc.value,
          label: loc.label.localized,
          contentBelow: intl.formatMessage({
            defaultMessage: "I'm willing to work 100% remotely.",
            id: "WoFBmk",
            description: "Checklist option explanatory note",
          }),
        };
      }
      if (loc.value === (FlexibleWorkLocation.Hybrid as string)) {
        return {
          value: loc.value,
          label: loc.label.localized,
          contentBelow: intl.formatMessage({
            defaultMessage:
              "I'm willing to work on-site at a department-designated location for a minimum of 3 days, with the rest being remote.",
            id: "4BJrSM",
            description: "Checklist option explanatory note",
          }),
        };
      }
      if (loc.value === (FlexibleWorkLocation.Onsite as string)) {
        return {
          value: loc.value,
          label: loc.label.localized,
          contentBelow: intl.formatMessage({
            defaultMessage:
              "I'm willing to work 100% on-site at a department-designated location.",
            id: "XNNBCv",
            description: "Checklist option explanatory note",
          }),
        };
      }
      return {
        value: loc.value,
        label: loc.label.localized,
      };
    });

  return (
    <div className="flex flex-col gap-6">
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
      <Field.Fieldset className="flex flex-col gap-6">
        <Field.Legend className="mb-6 text-lg font-bold lg:text-xl">
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
      <Field.Fieldset className="flex flex-col gap-6">
        <Field.Legend className="mb-6 text-lg font-bold lg:text-xl">
          {labels.workLocationPreferences}
        </Field.Legend>
        <p>
          {intl.formatMessage({
            defaultMessage:
              "Select the flexible work location options you're interested in. Keep in mind that most Government of Canada jobs are hybrid.",
            id: "ejzPh7",
            description:
              "Flexible work locations field label for work location preference form",
          })}
        </p>
        <Checklist
          idPrefix="work-location"
          legend={labels.flexibleWorkLocationOptions}
          name="flexibleWorkLocations"
          id="flexibleWorkLocations"
          items={formOptionsWithContentBelow}
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
        />
        <Checklist
          idPrefix="work-location"
          legend={labels.workLocationPreferences}
          name="locationPreferences"
          id="locationPreferences"
          items={localizedEnumToOptions(
            sortWorkRegion(unpackMaybes(data?.workRegions)).filter(
              /* remove 'Telework' enum from checklist of options */
              (region) => !(region.value === (WorkRegion.Telework as string)),
            ),
            intl,
          )}
        />
        <p>{labels.locationExemptions}</p>
        <TextArea
          id="location-exemptions"
          label={labels.locationExclusions}
          name="locationExemptions"
          aria-describedby="location-exemption-description"
        />
      </Field.Fieldset>
    </div>
  );
};

export default FormFields;
