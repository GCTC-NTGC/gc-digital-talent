import { useState } from "react";
import { useIntl } from "react-intl";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "urql";

import {
  RadioGroup,
  Select,
  Submit,
  localizedEnumToOptions,
  objectsToSortedOptions,
} from "@gc-digital-talent/forms";
import {
  FragmentType,
  PlacementType,
  PoolCandidateStatus,
  getFragment,
  graphql,
} from "@gc-digital-talent/graphql";
import {
  commonMessages,
  errorMessages,
  getLocalizedName,
  sortPlacementType,
} from "@gc-digital-talent/i18n";
import { Button, Dialog } from "@gc-digital-talent/ui";
import { toast } from "@gc-digital-talent/toast";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { hasRole, useAuthorization } from "@gc-digital-talent/auth";

import { isNotPlacedStatus, isQualifiedStatus } from "~/utils/poolCandidate";
import poolCandidateMessages from "~/messages/poolCandidateMessages";
import permissionConstants from "~/constants/permissionConstants";

export const PLACEMENT_TYPE_STATUSES = [
  PoolCandidateStatus.PlacedCasual,
  PoolCandidateStatus.PlacedIndeterminate,
  PoolCandidateStatus.PlacedTentative,
  PoolCandidateStatus.PlacedTerm,
];

const PlaceCandidate_Mutation = graphql(/* GraphQL */ `
  mutation PlaceCandidate_Mutation(
    $id: UUID!
    $placeCandidate: PlaceCandidateInput!
  ) {
    placeCandidate(id: $id, placeCandidate: $placeCandidate) {
      id
    }
  }
`);

const RevertPlaceCandidate_Mutation = graphql(/* GraphQL */ `
  mutation RevertPlaceCandidate_Mutation($id: UUID!) {
    revertPlaceCandidate(id: $id) {
      id
    }
  }
`);

export const JobPlacementDialog_Fragment = graphql(/* GraphQL */ `
  fragment JobPlacementDialog on PoolCandidate {
    id
    status {
      value
      label {
        en
        fr
      }
    }
    placedDepartment {
      id
      name {
        en
        fr
      }
    }
  }
`);

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

interface FormValues {
  placementType?: PlacementType | "NOT_PLACED";
  placedDepartment?: string;
}

interface JobPlacementDialogProps {
  jobPlacementDialogQuery: FragmentType<typeof JobPlacementDialog_Fragment>;
  optionsQuery?: JobPlacementOptionsFragmentType;
  context?: "table" | "view";
  defaultOpen?: boolean;
}

const JobPlacementDialog = ({
  jobPlacementDialogQuery,
  optionsQuery,
  context = "table",
  defaultOpen = false,
}: JobPlacementDialogProps) => {
  const intl = useIntl();
  const [isOpen, setIsOpen] = useState<boolean>(defaultOpen);
  const [, executePlacedCandidate] = useMutation(PlaceCandidate_Mutation);
  const [, executeRevertPlacedCandidate] = useMutation(
    RevertPlaceCandidate_Mutation,
  );

  const { roleAssignments } = useAuthorization();
  const unpackedRoleAssignments = unpackMaybes(roleAssignments);

  const canPlace = hasRole(
    permissionConstants().placeCandidates,
    unpackedRoleAssignments,
  );

  const {
    id: poolCandidateId,
    status,
    placedDepartment,
  } = getFragment(JobPlacementDialog_Fragment, jobPlacementDialogQuery);
  const options = getFragment(JobPlacementOptions_Query, optionsQuery);

  const placementType =
    status?.value && PLACEMENT_TYPE_STATUSES.includes(status?.value)
      ? (status.value as unknown as PlacementType)
      : "NOT_PLACED";

  const methods = useForm<FormValues>({
    defaultValues: {
      placementType,
      placedDepartment: placedDepartment?.id,
    },
  });

  if (!isQualifiedStatus(status?.value)) {
    return <span>{intl.formatMessage(commonMessages.notAvailable)}</span>;
  }

  const { handleSubmit, watch } = methods;
  const watchPlacementType = watch("placementType");

  const isPlaced = watchPlacementType !== "NOT_PLACED";

  const handleSuccess = () => {
    toast.success(
      intl.formatMessage({
        defaultMessage: "Job placement status saved successfully",
        id: "gr8+Es",
        description:
          "Message displayed when a job placement status has been saved.",
      }),
    );
  };

  const handleError = () => {
    toast.error(
      intl.formatMessage({
        defaultMessage:
          "Error: could not update candidate's job placement status",
        id: "8oOKi9",
        description:
          "Message displayed when an error occurs while updating pool candidate's job placement status",
      }),
    );
  };

  const handleFormSubmit: SubmitHandler<FormValues> = async (
    values: FormValues,
  ) => {
    if (values.placementType && values.placementType !== "NOT_PLACED") {
      await executePlacedCandidate({
        id: poolCandidateId,
        placeCandidate: {
          departmentId: values.placedDepartment ?? "",
          placementType: values.placementType,
        },
      })
        .then((result) => {
          if (result.data?.placeCandidate) {
            handleSuccess();
            setIsOpen(false);
          } else {
            handleError();
          }
        })
        .catch(() => {
          handleError();
        });
    } else {
      await executeRevertPlacedCandidate({
        id: poolCandidateId,
      })
        .then((result) => {
          if (result.data?.revertPlaceCandidate) {
            handleSuccess();
            setIsOpen(false);
          } else {
            handleError();
          }
        })
        .catch(() => {
          handleError();
        });
    }
  };

  const placementTypeOptions = [
    {
      value: "NOT_PLACED",
      label: intl.formatMessage(poolCandidateMessages.notPlaced),
    },
    ...localizedEnumToOptions(sortPlacementType(options?.placementTypes), intl),
  ];

  let label = intl.formatMessage(commonMessages.notAvailable);
  if (status) {
    if (isNotPlacedStatus(status.value)) {
      label = intl.formatMessage(poolCandidateMessages.notPlaced);
    }

    if (status.value && PLACEMENT_TYPE_STATUSES.includes(status.value)) {
      label = getLocalizedName(status.label, intl);
    }
  }

  if (!canPlace) {
    return <span>{label}</span>;
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger>
        <Button
          mode="inline"
          {...(context === "table"
            ? {
                color: "black",
              }
            : {
                color: "primary",
              })}
          data-h2-text-align="base(left)"
          aria-label={intl.formatMessage(
            {
              defaultMessage: "Placement: {placement}. Edit.",
              id: "wUqfbl",
              description: "Button text to edit the placement of a candidate",
            },
            { placement: label },
          )}
        >
          {label}
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header
          subtitle={intl.formatMessage({
            defaultMessage:
              "Keep track of this candidate's job placement using the following options.",
            id: "QSbP/J",
            description: "Subtitle for job placement dialog",
          })}
        >
          {intl.formatMessage({
            defaultMessage: "Job placement",
            id: "W3NvhG",
            description: "Heading job placement dialog",
          })}
        </Dialog.Header>
        <Dialog.Body>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
              <div data-h2-display="base(grid)" data-h2-gap="base(x1)">
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
              </div>
              <Dialog.Footer>
                <Submit
                  text={intl.formatMessage({
                    defaultMessage: "Save decision",
                    id: "DyHuZi",
                    description: "Submit message for job placement dialog",
                  })}
                />
                <Dialog.Close>
                  <Button color="warning" mode="inline">
                    {intl.formatMessage(commonMessages.cancel)}
                  </Button>
                </Dialog.Close>
              </Dialog.Footer>
            </form>
          </FormProvider>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export function jobPlacementDialogAccessor(
  jobPlacementDialogQuery: FragmentType<typeof JobPlacementDialog_Fragment>,
  optionsQuery?: JobPlacementOptionsFragmentType,
) {
  return (
    <JobPlacementDialog
      jobPlacementDialogQuery={jobPlacementDialogQuery}
      optionsQuery={optionsQuery}
    />
  );
}

export default JobPlacementDialog;
