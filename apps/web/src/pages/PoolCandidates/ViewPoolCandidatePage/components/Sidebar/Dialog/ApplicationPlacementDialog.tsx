import { FormProvider, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { useMutation, useQuery } from "urql";
import { useState } from "react";

import {
  FragmentType,
  getFragment,
  graphql,
  PlacementType,
  Scalars,
} from "@gc-digital-talent/graphql";
import { Button, Dialog, Pending } from "@gc-digital-talent/ui";
import { toast } from "@gc-digital-talent/toast";
import {
  hasRequiredRoles,
  ROLE_NAME,
  useAuthorization,
} from "@gc-digital-talent/auth";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { commonMessages } from "@gc-digital-talent/i18n";

import JobPlacementFormFields from "./FormFields/JobPlacementFormFields";
import Footer from "./Footer";

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
  }
`);

const ApplicationPlacementOptions_Query = graphql(/** GraphQL */ `
  query ApplicationPlacementOptions {
    ...JobPlacementFormFields
  }
`);

interface FormValues {
  placementType: PlacementType;
  department?: Scalars["UUID"]["input"];
}

interface ApplicationPlacementDialogProps {
  query: FragmentType<typeof ApplicationPlacementDialog_Fragment>;
}

const ApplicationPlacementDialog = ({
  query,
}: ApplicationPlacementDialogProps) => {
  const intl = useIntl();
  const [isOpen, setOpen] = useState<boolean>(false);
  const { userAuthInfo } = useAuthorization();
  const application = getFragment(ApplicationPlacementDialog_Fragment, query);
  const label =
    application.placementType?.label.localized ??
    intl.formatMessage(commonMessages.notAvailable);
  const methods = useForm<FormValues>({
    defaultValues: {
      placementType: application.placementType?.value,
      department: application.placedDepartment?.id,
    },
  });

  const [, executePlaceCandidate] = useMutation(PlaceCandidate_Mutation);
  const [, executeRevertPlacedCandidate] = useMutation(
    RevertPlaceCandidate_Mutation,
  );

  const [{ data, fetching, error }] = useQuery({
    query: ApplicationPlacementOptions_Query,
  });

  const canPlace = hasRequiredRoles({
    toCheck: [{ name: ROLE_NAME.CommunityRecruiter }],
    userRoles: unpackMaybes(userAuthInfo?.roleAssignments),
  });

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
