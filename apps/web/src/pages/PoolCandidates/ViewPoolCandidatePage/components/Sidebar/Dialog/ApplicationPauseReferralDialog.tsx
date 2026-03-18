import { useIntl } from "react-intl";
import { useMutation, useQuery } from "urql";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import {
  FragmentType,
  getFragment,
  graphql,
  ReferralPauseLength,
} from "@gc-digital-talent/graphql";
import { toast } from "@gc-digital-talent/toast";
import { Button, Dialog, Pending } from "@gc-digital-talent/ui";

import Footer from "./Footer";
import PauseReferralFormFields from "./FormFields/PauseReferralFormFields";
import { FormValues } from "./types";

const ApplicationPauseReferralOptions_Query = graphql(/** GraphQL */ `
  query ApplicationPauseReferralOptions {
    ...PauseReferralFormFields
  }
`);

const ApplicationPauseReferralDialog_Fragment = graphql(/** GraphQL */ `
  fragment ApplicationPauseReferralDialog on PoolCandidate {
    id

    ...PauseReferralFormMeta
  }
`);

const ApplicationPauseReferralDialog_Mutation = graphql(/** GraphQL */ `
  mutation pauseCandidateReferral(
    $id: UUID!
    $referralPause: ReferralPauseInput!
  ) {
    pauseCandidateReferral(id: $id, referralPause: $referralPause) {
      id
      referralPauseAt
      referralUnpauseAt
      referralPauseReason
    }
  }
`);

interface ApplicationPauseReferralDialogProps {
  query: FragmentType<typeof ApplicationPauseReferralDialog_Fragment>;
}

const ApplicationPauseReferralDialog = ({
  query,
}: ApplicationPauseReferralDialogProps) => {
  const intl = useIntl();
  const [isOpen, setOpen] = useState<boolean>(false);

  const [{ data: options, fetching, error }] = useQuery({
    query: ApplicationPauseReferralOptions_Query,
  });
  const application = getFragment(
    ApplicationPauseReferralDialog_Fragment,
    query,
  );
  const [, executePauseCandidateReferral] = useMutation(
    ApplicationPauseReferralDialog_Mutation,
  );

  const methods = useForm<FormValues>({
    defaultValues: {
      referralPauseStatus: false,
      referralUnpauseAt: undefined,
    },
  });

  const { handleSubmit: submit } = methods;

  const handleError = () => {
    toast.error(
      intl.formatMessage({
        defaultMessage: "Failed to update referral pause status",
        id: "xa2D5p",
        description: "Error message for updating referral pause status",
      }),
    );
  };

  const handleSubmit = async (values: FormValues) => {
    await executePauseCandidateReferral({
      id: application.id,
      referralPause: {
        referralPauseLength: values.referralPauseLength,
        referralUnpauseAt:
          values.referralPauseLength === ReferralPauseLength.Other
            ? values.referralUnpauseAt
            : null,
        referralPauseReason: values.referralPauseReason,
      },
    })
      .then((res) => {
        if (!res.data || res.error) {
          handleError();
          return;
        }

        toast.success(
          intl.formatMessage({
            defaultMessage: "Candidate name will no longer be referred",
            id: "48aunb",
            description:
              "Success message after pausing referrals for a candidate",
          }),
        );

        setOpen(false);
      })
      .catch(handleError);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Button mode="text" color="success" className="text-left">
          {intl.formatMessage({
            defaultMessage: "Actively being referred",
            id: "mAtGlT",
            description: "Dialog trigger for pause referral status dialog",
          })}
        </Button>
      </Dialog.Trigger>
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
            defaultMessage: "Pause candidate's referral status",
            id: "n/Y1Ex",
            description:
              "Title for the pause candidate's referral status dialog",
          })}
        </Dialog.Header>
        <Dialog.Body>
          <Pending fetching={fetching} error={error} inline>
            <p className="mb-6">
              {intl.formatMessage({
                defaultMessage:
                  "If you would like to temporarily prevent this candidate from appearing on talent requests, you use the following option.",
                id: "VuXPU8",
                description:
                  "Blurb for the pause candidate's referral status dialog",
              })}
            </p>
            <FormProvider {...methods}>
              <form onSubmit={submit(handleSubmit)}>
                <div className="flex flex-col gap-6">
                  <PauseReferralFormFields
                    optionsQuery={options}
                    metaQuery={application}
                    required
                  />
                </div>
                <Footer />
              </form>
            </FormProvider>
          </Pending>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ApplicationPauseReferralDialog;
