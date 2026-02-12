import { useState } from "react";
import { useIntl } from "react-intl";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "urql";

import { Submit } from "@gc-digital-talent/forms";
import {
  ApplicationStatus,
  FragmentType,
  PlacementType,
  getFragment,
  graphql,
} from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";
import { Button, Dialog } from "@gc-digital-talent/ui";
import { toast } from "@gc-digital-talent/toast";
import { ROLE_NAME, useAuthorization } from "@gc-digital-talent/auth";

import poolCandidateMessages from "~/messages/poolCandidateMessages";
import { checkRole } from "~/utils/teamUtils";
import { formValuesToPlaceCandidateInput } from "~/components/PoolCandidateDialogs/formUtils";

import JobPlacementForm, {
  FormValues,
  JobPlacementOptions_Query,
} from "./JobPlacementForm";

const PlaceCandidate_Mutation = graphql(/* GraphQL */ `
  mutation PlaceCandidate_Mutation(
    $id: UUID!
    $poolCandidate: PlaceCandidateInput!
  ) {
    placeCandidate(id: $id, poolCandidate: $poolCandidate) {
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
    }
    placementType {
      value
      label {
        localized
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

export const JobPlacementDialogCandidateTable_Fragment = graphql(/* GraphQL */ `
  fragment JobPlacementDialogCandidateTable on PoolCandidateAdminView {
    id
    status {
      value
    }
    placementType {
      value
      label {
        localized
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

interface JobPlacementDialogProps {
  jobPlacementDialogQuery: FragmentType<typeof JobPlacementDialog_Fragment>;
  optionsQuery?: FragmentType<typeof JobPlacementOptions_Query>;
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
  const [, executePlaceCandidate] = useMutation(PlaceCandidate_Mutation);
  const [, executeRevertPlacedCandidate] = useMutation(
    RevertPlaceCandidate_Mutation,
  );

  const { roleAssignments } = useAuthorization();
  const canPlace = checkRole(
    [ROLE_NAME.CommunityRecruiter, ROLE_NAME.CommunityAdmin],
    roleAssignments,
  );

  const candidate = getFragment(
    JobPlacementDialog_Fragment,
    jobPlacementDialogQuery,
  );

  const placementType =
    candidate.placementType?.value ?? PlacementType.NotPlaced;

  const methods = useForm<FormValues>({
    defaultValues: {
      placementType,
      placedDepartment: candidate.placedDepartment?.id,
    },
  });

  if (candidate.status?.value !== ApplicationStatus.Qualified) {
    return <span>{intl.formatMessage(commonMessages.notAvailable)}</span>;
  }

  const { handleSubmit } = methods;

  const handleFormSubmit: SubmitHandler<FormValues> = async (
    values: FormValues,
  ) => {
    let mutationPromise: Promise<void> | null = null;

    if (
      values.placementType &&
      values.placementType !== PlacementType.NotPlaced
    ) {
      mutationPromise = executePlaceCandidate({
        id: candidate.id,
        ...formValuesToPlaceCandidateInput(values),
      }).then((result) => {
        if (result.data?.placeCandidate) {
          return Promise.resolve();
        } else {
          return Promise.reject(new Error(result.error?.message));
        }
      });
    } else {
      mutationPromise = executeRevertPlacedCandidate({
        id: candidate.id,
      }).then((result) => {
        if (result.data?.revertPlaceCandidate) {
          return Promise.resolve();
        } else {
          return Promise.reject(new Error(result.error?.message));
        }
      });
    }

    await mutationPromise
      .then(() => {
        toast.success(
          intl.formatMessage({
            defaultMessage: "Job placement status saved successfully",
            id: "gr8+Es",
            description:
              "Message displayed when a job placement status has been saved.",
          }),
        );
        setIsOpen(false);
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage:
              "Error: could not update candidate's job placement status",
            id: "8oOKi9",
            description:
              "Message displayed when an error occurs while updating pool candidate's job placement status",
          }),
        );
      });
  };

  let label = intl.formatMessage(commonMessages.notAvailable);
  if (
    !candidate.placementType ||
    candidate.placementType.value === PlacementType.NotPlaced
  ) {
    label = intl.formatMessage(poolCandidateMessages.notPlaced);
  } else {
    label =
      candidate.placementType.label.localized ??
      intl.formatMessage(commonMessages.notAvailable);
  }

  if (!canPlace) {
    return <span>{label}</span>;
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger>
        <Button
          mode="text"
          {...(context === "table"
            ? {
                color: "black",
              }
            : {
                color: "secondary",
              })}
          className="text-left"
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
              <JobPlacementForm optionsQuery={optionsQuery} />
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
  optionsQuery?: FragmentType<typeof JobPlacementOptions_Query>,
) {
  return (
    <JobPlacementDialog
      jobPlacementDialogQuery={jobPlacementDialogQuery}
      optionsQuery={optionsQuery}
    />
  );
}

export default JobPlacementDialog;
