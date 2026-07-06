import { useState } from "react";
import { useIntl } from "react-intl";
import { useMutation } from "urql";
import { FormProvider, useForm } from "react-hook-form";

import { toast } from "@gc-digital-talent/toast";
import type { FragmentType } from "@gc-digital-talent/graphql";
import { getFragment, graphql } from "@gc-digital-talent/graphql";
import { Button, Dialog, Ul } from "@gc-digital-talent/ui";
import { strToFormDate } from "@gc-digital-talent/date-helpers";
import { HiddenInput } from "@gc-digital-talent/forms";
import { commonMessages } from "@gc-digital-talent/i18n";

import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";
import { getFullNameLabel } from "~/utils/nameUtils";

import Footer from "./Footer";

const ApplicationResumeReferralsDialog_Fragment = graphql(/** GraphQL */ `
  fragment ApplicationResumeReferralsDialog on PoolCandidate {
    id
    user {
      id
      firstName
      lastName
    }
    applicationStatusData {
      pauseReferralsAt
      resumeReferralsAt
      pauseReferralsReason
    }
  }
`);

const ApplicationResumeReferralsDialog_Mutation = graphql(/** GraphQL */ `
  mutation resumeCandidateReferrals($id: UUID!) {
    resumeCandidateReferrals(id: $id) {
      id
    }
  }
`);

interface FormValues {
  id: string;
}

interface ApplicationResumeReferralsDialogProps {
  query: FragmentType<typeof ApplicationResumeReferralsDialog_Fragment>;
}

const ApplicationResumeReferralsDialog = ({
  query,
}: ApplicationResumeReferralsDialogProps) => {
  const intl = useIntl();
  const [isOpen, setOpen] = useState<boolean>(false);

  const application = getFragment(
    ApplicationResumeReferralsDialog_Fragment,
    query,
  );
  const [, executeResumeCandidateReferrals] = useMutation(
    ApplicationResumeReferralsDialog_Mutation,
  );

  const methods = useForm<FormValues>({
    defaultValues: { id: application.id },
  });

  const handleError = () => {
    toast.error(
      intl.formatMessage({
        defaultMessage: "Failed to update referral status",
        id: "pFBkiu",
        description: "Error message for updating referral pause status",
      }),
    );
  };

  const handleSubmit = async () => {
    await executeResumeCandidateReferrals({ id: application.id })
      .then((res) => {
        if (!res.data || res.error) {
          handleError();
          return;
        }

        toast.success(
          intl.formatMessage(
            {
              defaultMessage: "{name} will now actively be referred.",
              id: "ji56hs",
              description:
                "Success message after unpausing referrals for a candidate",
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
        <Button mode="text" color="warning" className="text-left">
          {intl.formatMessage(commonMessages.notReferred)}
        </Button>
      </Dialog.Trigger>
      <Ul space="sm" className="text-gray-600 dark:text-gray-200">
        <li>
          {intl.formatMessage(
            {
              defaultMessage: "Until {resumeReferralsAt}",
              id: "rhD0HK",
              description: "Meta for the resume referrals date",
            },
            {
              resumeReferralsAt: strToFormDate(
                application.applicationStatusData?.resumeReferralsAt ?? "",
              ),
            },
          )}
        </li>
      </Ul>
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
            defaultMessage: "Resume referrals for this candidate",
            id: "Aq7OCi",
            description:
              "Title for the resume candidate's referral status dialog",
          })}
        </Dialog.Header>
        <Dialog.Body>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(handleSubmit)}>
              <HiddenInput name="id" />
              <div className="flex flex-col gap-6">
                <p>
                  {intl.formatMessage({
                    defaultMessage: "Candidate not being referred.",
                    id: "/v7hGH",
                    description:
                      "Blurb for the resume candidate's referral status dialog",
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
                    <li>
                      {strToFormDate(
                        application.applicationStatusData?.pauseReferralsAt ??
                          "",
                      )}
                    </li>
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
                      {strToFormDate(
                        application.applicationStatusData?.resumeReferralsAt ??
                          "",
                      )}
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
                    <li>
                      {intl.formatMessage(commonMessages.quotes, {
                        text: application.applicationStatusData
                          ?.pauseReferralsReason,
                      })}
                    </li>
                  </Ul>
                </FieldDisplay>
                <p>
                  {intl.formatMessage({
                    defaultMessage:
                      "Do you want to resume referrals for this candidate?",
                    id: "vGusoy",
                    description: "Final question in resume referrals dialog",
                  })}
                </p>
              </div>
              <Footer
                submitProps={{
                  color: "warning",
                  label: intl.formatMessage({
                    defaultMessage: "Resume candidate referral",
                    id: "mU4oY+",
                    description:
                      "Submit button label for resume referrals dialog",
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

export default ApplicationResumeReferralsDialog;
