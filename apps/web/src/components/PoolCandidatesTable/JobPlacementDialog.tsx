import React, { useState } from "react";
import { useIntl } from "react-intl";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "urql";
import MapPinIcon from "@heroicons/react/24/outline/MapPinIcon";

import {
  RadioGroup,
  Select,
  Submit,
  enumToOptions,
  objectsToSortedOptions,
} from "@gc-digital-talent/forms";
import {
  Department,
  FragmentType,
  Maybe,
  PlacementType,
  PoolCandidateStatus,
  getFragment,
  graphql,
  makeFragmentData,
} from "@gc-digital-talent/graphql";
import {
  commonMessages,
  errorMessages,
  getPlacementType,
} from "@gc-digital-talent/i18n";
import { Button, Dialog } from "@gc-digital-talent/ui";
import { toast } from "@gc-digital-talent/toast";

import { isQualifiedStatus, statusToJobPlacement } from "~/utils/poolCandidate";
import poolCandidateMessages from "~/messages/poolCandidateMessages";

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
  fragment JobPlacementDialog_Fragment on PoolCandidate {
    id
    status
    placedDepartment {
      id
      name {
        en
        fr
      }
    }
  }
`);

type FormValues = {
  placedJob?: PlacementType | "NOT_PLACED";
  placedDepartment?: string;
};

interface JobPlacementDialogProps {
  jobPlacementDialogQuery: FragmentType<typeof JobPlacementDialog_Fragment>;
  departments: Department[];
  context?: "table" | "view";
  defaultOpen?: boolean;
}

export const JobPlacementDialog = ({
  jobPlacementDialogQuery,
  departments,
  context = "table",
  defaultOpen = false,
}: JobPlacementDialogProps) => {
  const intl = useIntl();
  const [isOpen, setIsOpen] = useState<boolean>(defaultOpen);
  const [, executePlacedCandidate] = useMutation(PlaceCandidate_Mutation);
  const [, executeRevertPlacedCandidate] = useMutation(
    RevertPlaceCandidate_Mutation,
  );

  const {
    id: poolCandidateId,
    status,
    placedDepartment,
  } = getFragment(JobPlacementDialog_Fragment, jobPlacementDialogQuery);

  const placedJob =
    status && PLACEMENT_TYPE_STATUSES.includes(status)
      ? (status as unknown as PlacementType)
      : "NOT_PLACED";

  const methods = useForm<FormValues>({
    defaultValues: {
      placedJob,
      placedDepartment: placedDepartment?.id,
    },
  });

  if (!isQualifiedStatus(status)) {
    return <span>{intl.formatMessage(commonMessages.notAvailable)}</span>;
  }

  const { handleSubmit, watch } = methods;
  const watchPlacedJob = watch("placedJob");

  const isPlaced = watchPlacedJob !== "NOT_PLACED";

  const handleError = () => {
    toast.error(
      intl.formatMessage({
        defaultMessage:
          "Error: could not update pool candidate's job placement status",
        id: "UMR6ez",
        description:
          "Message displayed when an error occurs while updating pool candidate's job placement status",
      }),
    );
  };

  const handleFormSubmit: SubmitHandler<FormValues> = async (
    values: FormValues,
  ) => {
    if (values.placedJob && values.placedJob !== "NOT_PLACED") {
      await executePlacedCandidate({
        id: poolCandidateId,
        placeCandidate: {
          departmentId: values.placedDepartment,
          placementType: values.placedJob,
        },
      })
        .then((result) => {
          if (result.data?.placeCandidate) {
            toast.success(
              intl.formatMessage({
                defaultMessage: "Job placement saved successfully",
                id: "KK4Llj",
                description:
                  "Message displayed when a pool candidate has been placed successfully",
              }),
            );
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
            toast.success(
              intl.formatMessage({
                defaultMessage: "Revert placed candidate",
                id: "1icxaY",
                description:
                  "Message displayed when a pool candidate job placement status has been reverted",
              }),
            );
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

  const placedJobOptions = [
    {
      value: "NOT_PLACED",
      label: intl.formatMessage(poolCandidateMessages.notPlaced),
    },
    ...enumToOptions(PlacementType, [
      PlacementType.PlacedTentative,
      PlacementType.PlacedCasual,
      PlacementType.PlacedTerm,
      PlacementType.PlacedIndeterminate,
    ]).map(({ value }) => ({
      value,
      label: intl.formatMessage(getPlacementType(value)),
    })),
  ];

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
                icon: MapPinIcon,
                color: "primary",
              })}
        >
          {intl.formatMessage(statusToJobPlacement(status))}
        </Button>
        ) : (
          <Button icon={MapPinIcon} type="button" color="primary" mode="inline">
            {intl.formatMessage(statusToJobPlacement(status))}
          </Button>
        )}
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
                  idPrefix="placedJob"
                  name="placedJob"
                  legend={intl.formatMessage({
                    defaultMessage: "Job placement status",
                    id: "dpO8Va",
                    description: "Label for the job placement status field",
                  })}
                  items={placedJobOptions}
                />
                {isPlaced && (
                  <Select
                    id="placedDepartment"
                    name="placedDepartment"
                    label="Placed department"
                    nullSelection={intl.formatMessage({
                      defaultMessage: "Select a department",
                      id: "y827h2",
                      description:
                        "Null selection for department select input in the request form.",
                    })}
                    options={objectsToSortedOptions([...departments], intl)}
                    rules={{
                      required: intl.formatMessage(errorMessages.required),
                    }}
                  />
                )}
              </div>
              <Dialog.Footer data-h2-justify-content="base(flex-start)">
                <Submit
                  text={intl.formatMessage({
                    defaultMessage: "Save decision",
                    id: "DyHuZi",
                    description: "Submit message for job placement dialog",
                  })}
                  color="primary"
                  mode="solid"
                />
                <Dialog.Close>
                  <Button color="tertiary" mode="inline">
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

function jobPlacementDialogAccessor(
  poolCandidateId: string,
  departments: Department[],
  status?: Maybe<PoolCandidateStatus>,
  placedDepartment?: Maybe<Department>,
) {
  const jobPlacementDialogQuery = makeFragmentData(
    { id: poolCandidateId, status, placedDepartment },
    JobPlacementDialog_Fragment,
  );

  return (
    <JobPlacementDialog
      jobPlacementDialogQuery={jobPlacementDialogQuery}
      departments={departments}
    />
  );
}

export default jobPlacementDialogAccessor;
