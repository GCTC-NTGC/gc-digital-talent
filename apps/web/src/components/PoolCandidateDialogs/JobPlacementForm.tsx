import { useIntl } from "react-intl";
import { useFormContext } from "react-hook-form";

import {
  objectsToSortedOptions,
  RadioGroup,
  Select,
} from "@gc-digital-talent/forms";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import {
  commonMessages,
  ENUM_SORT_ORDER,
  errorMessages,
  narrowEnumType,
  sortLocalizedEnumOptions,
} from "@gc-digital-talent/i18n";
import { Notice } from "@gc-digital-talent/ui";
import {
  FragmentType,
  getFragment,
  graphql,
  PlacementType,
} from "@gc-digital-talent/graphql";

import poolCandidateMessages from "~/messages/poolCandidateMessages";

export const JobPlacementOptions_Query = graphql(/* GraphQL */ `
  fragment JobPlacementOptions on Query {
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

export type JobPlacementOptionsFragmentType = FragmentType<
  typeof JobPlacementOptions_Query
>;
export interface FormValues {
  placementType?: PlacementType;
  placedDepartment?: string;
}

interface JobPlacementFormProps {
  optionsQuery?: JobPlacementOptionsFragmentType;
}

const JobPlacementForm = ({ optionsQuery }: JobPlacementFormProps) => {
  const intl = useIntl();
  const notAvailable = intl.formatMessage(commonMessages.notAvailable);

  const methods = useFormContext<FormValues>();

  const { watch } = methods;

  const watchPlacementType = watch("placementType");
  const isPlaced = watchPlacementType !== PlacementType.NotPlaced;

  const options = getFragment(JobPlacementOptions_Query, optionsQuery);

  const placementTypes = sortLocalizedEnumOptions(
    ENUM_SORT_ORDER.PLACEMENT_TYPE,
    narrowEnumType(unpackMaybes(options?.placementTypes), "PlacementType"),
  );

  const placementTypeOptions = placementTypes
    .map((placementType) => ({
      value: placementType.value,
      label: placementType.label.localized ?? notAvailable,
    }))
    .map((option) => {
      if (option.value === PlacementType.UnderConsideration) {
        return {
          ...option,
          contentBelow: intl.formatMessage(
            poolCandidateMessages.underConsiderationDesc,
          ),
        };
      }
      if (option.value === PlacementType.PlacedTentative) {
        return {
          ...option,
          contentBelow: intl.formatMessage(
            poolCandidateMessages.PlacedTentativeDesc,
          ),
        };
      }

      return option;
    });

  const underConsideration = placementTypes.find(
    (pt) => pt.value === PlacementType.UnderConsideration,
  );
  const placedTerm = placementTypes.find(
    (pt) => pt.value === PlacementType.PlacedTerm,
  );
  const placedIndeterminate = placementTypes.find(
    (pt) => pt.value === PlacementType.PlacedIndeterminate,
  );

  const enumLabelMap = new Map<PlacementType, string>([
    [
      PlacementType.UnderConsideration,
      underConsideration?.label.localized ?? notAvailable,
    ],
    [PlacementType.PlacedTerm, placedTerm?.label.localized ?? notAvailable],
    [
      PlacementType.PlacedIndeterminate,
      placedIndeterminate?.label.localized ?? notAvailable,
    ],
  ]);

  return (
    <div className="flex flex-col gap-y-6">
      <RadioGroup
        idPrefix="placementType"
        name="placementType"
        legend={intl.formatMessage({
          defaultMessage: "Job placement status",
          id: "dpO8Va",
          description: "Label for the job placement status field",
        })}
        items={placementTypeOptions}
      />
      {isPlaced && (
        <Select
          id="placedDepartment"
          name="placedDepartment"
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
          options={objectsToSortedOptions(
            unpackMaybes(options?.departments),
            intl,
          )}
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
        />
      )}
      {(watchPlacementType === PlacementType.UnderConsideration ||
        watchPlacementType === PlacementType.PlacedTerm ||
        watchPlacementType === PlacementType.PlacedIndeterminate) && (
        <Notice.Root>
          <Notice.Title>{enumLabelMap.get(watchPlacementType)}</Notice.Title>
          <Notice.Content>
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "This candidate will not appear in talent request results based on this process.",
                id: "dDrs39",
                description:
                  "Notice that candidates under consideration do not appear in talent search requests",
              })}
            </p>
          </Notice.Content>
        </Notice.Root>
      )}
    </div>
  );
};

export default JobPlacementForm;
