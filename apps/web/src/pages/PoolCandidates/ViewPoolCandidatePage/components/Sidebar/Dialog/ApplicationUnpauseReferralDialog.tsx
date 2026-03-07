import { useState } from "react";
import { useIntl } from "react-intl";
import { useMutation } from "urql";
import { FormProvider, useForm } from "react-hook-form";

import { toast } from "@gc-digital-talent/toast";
import {
  FragmentType,
  getFragment,
  graphql,
  Scalars,
} from "@gc-digital-talent/graphql";
import { Button, Dialog, Ul } from "@gc-digital-talent/ui";
import { strToFormDate } from "@gc-digital-talent/date-helpers";
import { HiddenInput } from "@gc-digital-talent/forms";

import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";

import Footer from "./Footer";

const ApplicationUnpauseReferralDialog_Fragment = graphql(/** GraphQL */ `
  fragment ApplicationUnpauseReferralDialog on PoolCandidate {
    id
    referralPauseAt
    referralUnpauseAt
    referralPauseReason
  }
`);

const ApplicationUnpauseReferralDialog_Mutation = graphql(/** GraphQL */ `
  mutation unpauseCandidateReferral($id: UUID!) {
    unpauseCandidateReferral(id: $id) {
      id
    }
  }
`);

interface FormValues {
  id: Scalars["UUID"]["input"];
}

interface ApplicationUnpauseReferralDialogProps {
  query: FragmentType<typeof ApplicationUnpauseReferralDialog_Fragment>;
}

const ApplicationUnpauseReferralDialog = ({
  query,
}: ApplicationUnpauseReferralDialogProps) => {
  const intl = useIntl();
  const [isOpen, setOpen] = useState<boolean>(false);

  const application = getFragment(
    ApplicationUnpauseReferralDialog_Fragment,
    query,
  );
  const [, executeUnpauseCandidateReferral] = useMutation(
    ApplicationUnpauseReferralDialog_Mutation,
  );

  const methods = useForm<FormValues>({
    defaultValues: { id: application.id },
  });

  const handleError = () => {
    toast.error(
      intl.formatMessage({
        defaultMessage: "Failed to update referral pause status",
        id: "xa2D5p",
        description: "Error message for updating referral pause status",
      }),
    );
  };

  const handleSubmit = async () => {
    await executeUnpauseCandidateReferral({ id: application.id })
      .then((res) => {
        if (!res.data || res.error) {
          handleError();
          return;
        }

        toast.success(
          intl.formatMessage({
            defaultMessage: "Referral pause status updated successfully",
            id: "LzHJtH",
            description: "Success message for updating referral status",
          }),
        );

        setOpen(false);
      })
      .catch(handleError);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Button mode="text" color="warning" className="text-left">
          {intl.formatMessage({
            defaultMessage: "Not referred",
            id: "YJ9DuG",
            description: "Dialog trigger for unpause referral status dialog",
          })}
        </Button>
      </Dialog.Trigger>
      <Ul space="sm" className="text-gray-600 dark:text-gray-200">
        <li>
          {intl.formatMessage(
            {
              defaultMessage: "Until {referralUnpauseDate}",
              id: "bI9M3A",
              description: "Meta for the referral unpause date",
            },
            {
              referralUnpauseDate: strToFormDate(
                application.referralUnpauseAt ?? "",
              ),
            },
          )}
        </li>
      </Ul>
      <Dialog.Content>
        <Dialog.Header
          subtitle={intl.formatMessage({
            defaultMessage:
              "Manage when this candidate appears on talent requests.",
            id: "uUOZbw",
            description: "Subtitle for the pause candidate's referral status",
          })}
        >
          {intl.formatMessage({
            defaultMessage: "Unpause candidate's referral status",
            id: "iObwWy",
            description:
              "Title for the pause candidate's referral status dialog",
          })}
        </Dialog.Header>
        <Dialog.Body>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(handleSubmit)}>
              <HiddenInput name="id" />
              <div className="flex flex-col gap-6">
                <p>
                  {intl.formatMessage({
                    defaultMessage: "This candidate is not being referred.",
                    id: "vVMVRz",
                    description:
                      "Blurb for the unpause candidate's referral status dialog",
                  })}
                </p>
                <FieldDisplay
                  label={intl.formatMessage({
                    defaultMessage: "Pause start date",
                    id: "tQdIlW",
                    description: "Label for pause start date",
                  })}
                >
                  <Ul space="sm">
                    <li>{strToFormDate(application.referralPauseAt ?? "")}</li>
                  </Ul>
                </FieldDisplay>
                <FieldDisplay
                  label={intl.formatMessage({
                    defaultMessage: "Pause end date",
                    id: "Gqm8TR",
                    description: "Label for pause end date",
                  })}
                >
                  <Ul space="sm">
                    <li>
                      {strToFormDate(application.referralUnpauseAt ?? "")}
                    </li>
                  </Ul>
                </FieldDisplay>
                <FieldDisplay
                  label={intl.formatMessage({
                    defaultMessage: "Pause reason",
                    id: "5cnajL",
                    description: "Label for pause reason",
                  })}
                >
                  <Ul space="sm">
                    {/* eslint-disable-next-line formatjs/no-literal-string-in-jsx */}
                    <li>&ldquo;{application.referralPauseReason}&ldquo;</li>
                  </Ul>
                </FieldDisplay>
                <p>
                  {intl.formatMessage({
                    defaultMessage:
                      "Do you wish to unpause this candidate's referral?",
                    id: "cC0vKC",
                    description: "Final question in unpause referral dialog",
                  })}
                </p>
              </div>
              <Footer
                submitProps={{
                  color: "warning",
                  label: intl.formatMessage({
                    defaultMessage: "Unpause candidate referral",
                    id: "ezHMWk",
                    description:
                      "Submit button label for unpause referral dialog",
                  }),
                }}
              />
            </form>
          </FormProvider>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ApplicationUnpauseReferralDialog;
