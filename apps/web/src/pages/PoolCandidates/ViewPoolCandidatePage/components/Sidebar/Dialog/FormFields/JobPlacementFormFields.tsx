import { useFormContext } from "react-hook-form";
import { defineMessage, useIntl } from "react-intl";

import type { FragmentType } from "@gc-digital-talent/graphql";
import {
  getFragment,
  graphql,
  PlacementType,
} from "@gc-digital-talent/graphql";
import {
  commonMessages,
  ENUM_SORT_ORDER,
  errorMessages,
  narrowEnumType,
  sortLocalizedEnumOptions,
} from "@gc-digital-talent/i18n";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { DateInput, Select } from "@gc-digital-talent/forms";

import type { FormValues } from "../types";
import { hasPlacedStartDate } from "../../utils";

const placedStartDateLabel = defineMessage({
  defaultMessage: "Placed position start date",
  id: "ob2lBu",
  description: "Label for placed start date input",
});

const placedEndDateLabel = defineMessage({
  defaultMessage: "Placed position end date",
  id: "xMeWyN",
  description: "Label for placed end date input",
});

const JobPlacementFormFields_Fragment = graphql(/* GraphQL */ `
  fragment JobPlacementFormFields on Query {
    placementTypes: localizedEnumOptions(enumName: "PlacementType") {
      ... on LocalizedPlacementType {
        value
        label {
          localized
        }
      }
    }
    departments {
      id
      name {
        localized
      }
    }
  }
`);

interface JobPlacementFormFieldsProps {
  query?: FragmentType<typeof JobPlacementFormFields_Fragment>;
  required?: boolean;
}

const JobPlacementFormFields = ({
  query,
  required = false,
}: JobPlacementFormFieldsProps) => {
  const intl = useIntl();
  const { watch } = useFormContext<FormValues>();
  const options = getFragment(JobPlacementFormFields_Fragment, query);
  const selectedType = watch("placementType");
  const placedStartDate = watch("placedStartDate");
  const notAvailable = intl.formatMessage(commonMessages.notAvailable);

  const isPlaced = selectedType && selectedType !== PlacementType.NotPlaced;
  const isPlacedIndeterminate =
    selectedType && selectedType === PlacementType.PlacedIndeterminate;

  const placementTypeOptions = sortLocalizedEnumOptions(
    ENUM_SORT_ORDER.PLACEMENT_TYPE,
    narrowEnumType(unpackMaybes(options?.placementTypes), "PlacementType"),
  ).map((placementType) => ({
    value: placementType.value,
    label: placementType.label.localized ?? notAvailable,
  }));

  return (
    <>
      <Select
        id="placementType"
        name="placementType"
        options={placementTypeOptions}
        label={intl.formatMessage({
          defaultMessage: "Job placement status",
          id: "dpO8Va",
          description: "Label for the job placement status field",
        })}
        nullSelection={intl.formatMessage({
          defaultMessage: "Select a placement status",
          id: "lA4Gwl",
          description: "Null selection for placement status select input",
        })}
        {...(required
          ? { rules: { required: intl.formatMessage(errorMessages.required) } }
          : {})}
      />

      {isPlaced && (
        <Select
          id="department"
          name="department"
          label={intl.formatMessage({
            defaultMessage: "Placed department",
            id: "G8JoCN",
            description: "Label for the placed department field",
          })}
          nullSelection={intl.formatMessage({
            defaultMessage: "Select a department",
            id: "y827h2",
            description:
              "Null selection for department select input in the request form.",
          })}
          options={unpackMaybes(options?.departments).map((dept) => ({
            value: dept.id,
            label: dept.name.localized ?? notAvailable,
          }))}
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
        />
      )}
      {hasPlacedStartDate(selectedType) && (
        <>
          <DateInput
            id="placedStartDate"
            name="placedStartDate"
            legend={intl.formatMessage(placedStartDateLabel)}
          />
          {!isPlacedIndeterminate && (
            <DateInput
              id="placedEndDate"
              name="placedEndDate"
              legend={intl.formatMessage(placedEndDateLabel)}
              rules={{
                min: {
                  value: placedStartDate ? String(placedStartDate) : "",
                  message: intl.formatMessage(errorMessages.minDateSelfLabel, {
                    labelSelf: intl.formatMessage(placedEndDateLabel),
                    labelAssociated: intl.formatMessage(placedStartDateLabel),
                  }),
                },
              }}
            />
          )}
        </>
      )}
    </>
  );
};

export default JobPlacementFormFields;
