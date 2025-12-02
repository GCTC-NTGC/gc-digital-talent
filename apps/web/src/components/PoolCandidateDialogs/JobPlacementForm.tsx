import { useIntl } from "react-intl";
import { useFormContext } from "react-hook-form";

import {
  localizedEnumToOptions,
  objectsToSortedOptions,
  RadioGroup,
  Select,
} from "@gc-digital-talent/forms";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import {
  errorMessages,
  getLocalizedName,
  sortPlacementType,
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
    placementTypes: localizedEnumStrings(enumName: "PlacementType") {
      value
      label {
        en
        fr
      }
    }
    departments {
      id
      name {
        en
        fr
      }
    }
  }
`);

export type JobPlacementOptionsFragmentType = FragmentType<
  typeof JobPlacementOptions_Query
>;
export interface FormValues {
  placementType?: PlacementType | "NOT_PLACED";
  placedDepartment?: string;
}

interface JobPlacementFormProps {
  optionsQuery?: JobPlacementOptionsFragmentType;
}

const JobPlacementForm = ({ optionsQuery }: JobPlacementFormProps) => {
  const intl = useIntl();

  const methods = useFormContext<FormValues>();

  const { watch } = methods;

  const watchPlacementType = watch("placementType");
  const isPlaced = watchPlacementType !== "NOT_PLACED";

  const options = getFragment(JobPlacementOptions_Query, optionsQuery);

  const placementTypeOptions = [
    {
      value: "NOT_PLACED",
      label: intl.formatMessage(poolCandidateMessages.notPlaced),
    },
    ...localizedEnumToOptions(sortPlacementType(options?.placementTypes), intl),
  ].map((option) => {
    if (option.value === PlacementType.UnderConsideration.toString()) {
      return {
        ...option,
        contentBelow: intl.formatMessage(
          poolCandidateMessages.underConsiderationDesc,
        ),
      };
    }
    if (option.value === PlacementType.PlacedTentative.toString()) {
      return {
        ...option,
        contentBelow: intl.formatMessage(
          poolCandidateMessages.PlacedTentativeDesc,
        ),
      };
    }

    return option;
  });

  const underConsideration = options?.placementTypes?.find(
    (pt) => pt.value === PlacementType.UnderConsideration.toString(),
  );
  const placedTerm = options?.placementTypes?.find(
    (pt) => pt.value === PlacementType.PlacedTerm.toString(),
  );
  const placedIndeterminate = options?.placementTypes?.find(
    (pt) => pt.value === PlacementType.PlacedIndeterminate.toString(),
  );

  const enumLabelMap = new Map<PlacementType, string>([
    [
      PlacementType.UnderConsideration,
      getLocalizedName(underConsideration?.label, intl),
    ],
    [PlacementType.PlacedTerm, getLocalizedName(placedTerm?.label, intl)],
    [
      PlacementType.PlacedIndeterminate,
      getLocalizedName(placedIndeterminate?.label, intl),
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
          <Notice.Content>
            <p className="mb-1.5 font-bold">
              {enumLabelMap.get(watchPlacementType)}
            </p>
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
