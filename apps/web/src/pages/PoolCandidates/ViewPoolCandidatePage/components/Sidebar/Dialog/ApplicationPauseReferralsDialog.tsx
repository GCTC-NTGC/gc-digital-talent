import { useIntl } from "react-intl";
import { useMutation, useQuery } from "urql";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import type { FragmentType } from "@gc-digital-talent/graphql";
import {
  getFragment,
  graphql,
  PauseReferralsLength,
} from "@gc-digital-talent/graphql";
import { toast } from "@gc-digital-talent/toast";
import { Button, Dialog, Pending } from "@gc-digital-talent/ui";

import { getFullNameLabel } from "~/utils/nameUtils";
import poolCandidateMessages from "~/messages/poolCandidateMessages";

import Footer from "./Footer";
import PauseReferralsFormFields from "./FormFields/PauseReferralsFormFields";
import type { FormValues } from "./types";

const ApplicationPauseReferralsOptions_Query = graphql(/** GraphQL */ `
  query ApplicationPauseReferralsOptions {
    ...PauseReferralsFormFields
  }
`);

const ApplicationPauseReferralsDialog_Fragment = graphql(/** GraphQL */ `
  fragment ApplicationPauseReferralsDialog on PoolCandidate {
    id
    user {
      id
      firstName
      lastName
    }
    ...PauseReferralsFormMeta
  }
`);

const ApplicationPauseReferralsDialog_Mutation = graphql(/** GraphQL */ `
  mutation pauseCandidateReferrals(
    $id: UUID!
    $pauseReferrals: PauseReferralsInput!
  ) {
    pauseCandidateReferrals(id: $id, pauseReferrals: $pauseReferrals) {
      id
      applicationStatusData {
        pauseReferralsAt
        resumeReferralsAt
        pauseReferralsReason
      }
    }
  }
`);

interface ApplicationPauseReferralsDialogProps {
  query: FragmentType<typeof ApplicationPauseReferralsDialog_Fragment>;
}

const ApplicationPauseReferralsDialog = ({
  query,
}: ApplicationPauseReferralsDialogProps) => {
  const intl = useIntl();
  const [isOpen, setOpen] = useState<boolean>(false);

  const [{ data: options, fetching, error }] = useQuery({
    query: ApplicationPauseReferralsOptions_Query,
  });
  const application = getFragment(
    ApplicationPauseReferralsDialog_Fragment,
    query,
  );
  const [, executePauseCandidateReferral] = useMutation(
    ApplicationPauseReferralsDialog_Mutation,
  );

  const methods = useForm<FormValues>({
    defaultValues: {
      referralPauseStatus: false,
      resumeReferralsAt: undefined,
    },
  });

  const { handleSubmit: submit } = methods;

  const handleError = () => {
    toast.error(
      intl.formatMessage({
        defaultMessage: "Failed to update referral status",
        id: "pFBkiu",
        description: "Error message for updating referral pause status",
      }),
    );
  };

  const handleSubmit = async (values: FormValues) => {
    await executePauseCandidateReferral({
      id: application.id,
      pauseReferrals: {
        pauseReferralsLength: values.pauseReferralsLength,
        resumeReferralsAt:
          values.pauseReferralsLength === PauseReferralsLength.Other
            ? values.resumeReferralsAt
            : null,
        pauseReferralsReason: values.pauseReferralsReason,
      },
    })
      .then((res) => {
        if (!res.data || res.error) {
          handleError();
          return;
        }

        toast.success(
          intl.formatMessage(
            {
              defaultMessage: "{name} will no longer be referred.",
              id: "LWI0Ds",
              description:
                "Success message after pausing referrals for a candidate",
            },
            {
              name: getFullNameLabel(
                application.user.firstName,
                application.user.lastName,
                intl,
              ),
            },
          ),
        );

        setOpen(false);
      })
      .catch(handleError);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Button mode="text" color="success" className="text-left">
          {intl.formatMessage(poolCandidateMessages.availableForReferral)}
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header
          subtitle={intl.formatMessage({
            defaultMessage:
              "Manage this candidate's visibility in talent requests.",
            id: "dqC81Y",
            description: "Subtitle for the pause candidate's referral status",
          })}
        >
          {intl.formatMessage({
            defaultMessage: "Pause referral status for this candidate",
            id: "CWWDgb",
            description:
              "Title for the pause candidate's referral status dialog",
          })}
        </Dialog.Header>
        <Dialog.Body>
          <Pending fetching={fetching} error={error} inline>
            <p className="mb-6">
              {intl.formatMessage({
                defaultMessage:
                  "To temporarily prevent this candidate from appearing in talent requests, use the following option.",
                id: "u+3kse",
                description:
                  "Blurb for the pause candidate's referral status dialog",
              })}
            </p>
            <FormProvider {...methods}>
              <form onSubmit={submit(handleSubmit)}>
                <div className="flex flex-col gap-6">
                  <PauseReferralsFormFields
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

export default ApplicationPauseReferralsDialog;
