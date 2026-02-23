import { useFormContext } from "react-hook-form";
import { useIntl } from "react-intl";

import {
  FragmentType,
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
import { Select } from "@gc-digital-talent/forms";

import { FormValues } from "../types";

export const JobPlacementFormFields_Fragment = graphql(/* GraphQL */ `
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
  const notAvailable = intl.formatMessage(commonMessages.notAvailable);

  const isPlaced = selectedType && selectedType !== PlacementType.NotPlaced;

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
    </>
  );
};

export default JobPlacementFormFields;
