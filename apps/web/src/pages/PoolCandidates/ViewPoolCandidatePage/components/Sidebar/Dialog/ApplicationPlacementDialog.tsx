import { FormProvider, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { useMutation, useQuery } from "urql";
import { useState } from "react";

import type { FragmentType } from "@gc-digital-talent/graphql";
import {
  getFragment,
  graphql,
  Permission,
  PlacementType,
} from "@gc-digital-talent/graphql";
import { Button, Dialog, Pending } from "@gc-digital-talent/ui";
import { toast } from "@gc-digital-talent/toast";
import { useHasPermissions } from "@gc-digital-talent/auth";
import { commonMessages } from "@gc-digital-talent/i18n";

import poolCandidateMessages from "~/messages/poolCandidateMessages";

import JobPlacementFormFields from "./FormFields/JobPlacementFormFields";
import Footer from "./Footer";
import { hasPlacedStartDate } from "../utils";

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

const ApplicationPlacementDialog_Fragment = graphql(/** GraphQL */ `
  fragment ApplicationPlacementDialog on PoolCandidate {
    id
    applicationStatusData {
      placementType {
        value
        label {
          localized
        }
      }
      placedDepartment {
        id
        name {
          localized
        }
      }
      placedStartDate
      placedEndDate
    }
  }
`);

const ApplicationPlacementOptions_Query = graphql(/** GraphQL */ `
  query ApplicationPlacementOptions {
    ...JobPlacementFormFields
  }
`);

interface FormValues {
  placementType: PlacementType;
  department?: string;
  placedStartDate: string | null;
  placedEndDate: string | null;
}

interface ApplicationPlacementDialogProps {
  query: FragmentType<typeof ApplicationPlacementDialog_Fragment>;
}

const ApplicationPlacementDialog = ({
  query,
}: ApplicationPlacementDialogProps) => {
  const intl = useIntl();
  const [isOpen, setOpen] = useState<boolean>(false);
  const application = getFragment(ApplicationPlacementDialog_Fragment, query);
  const methods = useForm<FormValues>({
    defaultValues: {
      placementType: application.applicationStatusData?.placementType?.value,
      department: application.applicationStatusData?.placedDepartment?.id,
      placedStartDate:
        application.applicationStatusData?.placedStartDate ?? undefined,
      placedEndDate:
        application.applicationStatusData?.placedEndDate ?? undefined,
    },
  });

  const [, executePlaceCandidate] = useMutation(PlaceCandidate_Mutation);
  const [, executeRevertPlacedCandidate] = useMutation(
    RevertPlaceCandidate_Mutation,
  );

  const [{ data, fetching, error }] = useQuery({
    query: ApplicationPlacementOptions_Query,
  });

  let label =
    application.applicationStatusData?.placementType?.label.localized ??
    intl.formatMessage(commonMessages.notAvailable);
  if (
    !application.applicationStatusData?.placementType?.value ||
    application.applicationStatusData?.placementType?.value === null ||
    application.applicationStatusData?.placementType?.value ===
      PlacementType.NotPlaced
  ) {
    label = intl.formatMessage(poolCandidateMessages.notPlaced);
  }
  const canPlace = useHasPermissions([
    { permission: Permission.UpdateAnyApplicationPlacement },
    { permission: Permission.UpdateTeamApplicationPlacement },
  ]);

  if (!canPlace) {
    return <span className="text-gray-600 dark:text-gray-200">{label}</span>;
  }

  const handleError = () => {
    toast.error(
      intl.formatMessage({
        defaultMessage: "Error: Could not update placement status",
        id: "aH8uvT",
        description: "Error message when placement status could not be updated",
      }),
    );
  };

  const placeCandidate = async (formValues: FormValues) => {
    return executePlaceCandidate({
      id: application.id,
      poolCandidate: {
        placementType: formValues.placementType,
        department: { connect: formValues.department ?? "" },
        placedStartDate: hasPlacedStartDate(formValues.placementType)
          ? formValues.placedStartDate
          : null,
        placedEndDate:
          hasPlacedStartDate(formValues.placementType) &&
          formValues.placementType !== PlacementType.PlacedIndeterminate
            ? formValues.placedEndDate
            : null,
      },
    });
  };

  const revertPlacement = async (_: FormValues) => {
    return executeRevertPlacedCandidate({ id: application.id });
  };

  const handleSubmit = async (formValues: FormValues) => {
    const mutation =
      formValues.placementType === PlacementType.NotPlaced
        ? revertPlacement
        : placeCandidate;

    await mutation(formValues)
      .then((res) => {
        if (!res.data || res.error) {
          handleError();
          return;
        }

        methods.resetField("placedStartDate", {
          defaultValue: hasPlacedStartDate(formValues.placementType)
            ? formValues.placedStartDate
            : null,
        });
        methods.resetField("placedEndDate", {
          defaultValue:
            hasPlacedStartDate(formValues.placementType) &&
            formValues.placementType !== PlacementType.PlacedIndeterminate
              ? formValues.placedEndDate
              : null,
        });

        toast.success(
          intl.formatMessage({
            defaultMessage: "Placement status updated successfully!",
            id: "vbYcIR",
            description:
              "Success message displayed after updating placement status",
          }),
        );

        setOpen(false);
      })
      .catch(handleError);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Button
          mode="inline"
          color="success"
          className="text-left font-normal"
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
              "Keep track of a candidate's job placement using the following options.",
            id: "rwjZZT",
            description:
              "Subtitle for the dialog to update a candidates placement status",
          })}
        >
          {intl.formatMessage({
            defaultMessage: "Change placement status",
            id: "pohP0Z",
            description:
              "Heading for the dialog to change a candidates placement status",
          })}
        </Dialog.Header>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleSubmit)}>
            <Dialog.Body>
              <div className="flex flex-col gap-y-6">
                <Pending fetching={fetching} error={error} inline>
                  <JobPlacementFormFields query={data} required />
                </Pending>
              </div>
              <Footer />
            </Dialog.Body>
          </form>
        </FormProvider>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ApplicationPlacementDialog;
