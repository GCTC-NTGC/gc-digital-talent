import type { IntlShape } from "react-intl";
import { useIntl } from "react-intl";
import CheckCircleIcon from "@heroicons/react/24/solid/CheckCircleIcon";

import { Button, Card, Notice } from "@gc-digital-talent/ui";
import type { FragmentType } from "@gc-digital-talent/graphql";
import { EmailType, getFragment, graphql } from "@gc-digital-talent/graphql";

import EmailVerificationDialog from "~/components/EmailVerificationDialog/EmailVerificationDialog";
import RemoveWorkEmailDialog from "~/components/WorkEmailCard/RemoveWorkEmailDialog";

const GovernmentInformationCard_Fragment = graphql(/** GraphQL */ `
  fragment GovernmentInformationCard on User {
    id
    email
    workEmail
    isWorkEmailVerified
  }
`);

// what text will trigger the <EmailVerificationDialog />
const determineVerificationDialogText = (
  intl: IntlShape,
  email?: string | null,
  workEmail?: string | null,
  isWorkEmailVerified?: boolean | null,
): string => {
  // verified work email, same as contact email
  if (!!workEmail && !!isWorkEmailVerified && !!email && workEmail === email) {
    return intl.formatMessage({
      defaultMessage: "Verify a different work email",
      id: "buTxFT",
      description:
        "Link to update to a different email when initially your work email and contact email are the same",
    });
  }

  // verified work email, distinct from contact email
  if (!!workEmail && !!isWorkEmailVerified) {
    return intl.formatMessage({
      defaultMessage: "Update work email",
      id: "9jO3/H",
      description: "Link to update email",
    });
  }

  // unverified work email
  if (!!workEmail && !isWorkEmailVerified) {
    return intl.formatMessage({
      defaultMessage: "Re-verify work email",
      id: "mriIoW",
      description: "Link to redo email verification",
    });
  }

  // fallback, all other cases
  return intl.formatMessage({
    defaultMessage: "Verify a GC work email",
    id: "Vd9VIn",
    description: "Link to update the work email",
  });
};

interface GovernmentInformationCardProps {
  query: FragmentType<typeof GovernmentInformationCard_Fragment>;
}

const GovernmentInformationCard = ({
  query,
}: GovernmentInformationCardProps) => {
  const intl = useIntl();
  const workEmailFragment = getFragment(
    GovernmentInformationCard_Fragment,
    query,
  );

  return (
    <Card space="lg">
      <p className="font-bold">
        {intl.formatMessage({
          defaultMessage: "Government of Canada employee information",
          id: "dEs2Uk",
          description: "Label for gov of canada work email",
        })}
      </p>
      <p className="mb-6 text-sm text-gray-600 dark:text-gray-200">
        {intl.formatMessage({
          defaultMessage:
            "If you're a Government of Canada employee, verifying your work email and adding your current role to your career experience will give you access to employee tools.",
          id: "0dAZ6V",
          description:
            "Gov of canada work email card description on account settings page",
        })}
      </p>
      <div className="mb-9">
        {workEmailFragment.workEmail ? (
          <Notice.Root>
            <Notice.Title>
              {intl.formatMessage({
                defaultMessage: "Work email verification",
                id: "1zsfA7",
                description: "Label for gov of canada work email verification",
              })}
            </Notice.Title>
            <Notice.Content>
              <span className="flex items-center gap-1.5">
                {workEmailFragment.isWorkEmailVerified && (
                  <CheckCircleIcon
                    className="size-4 text-success"
                    aria-hidden="false"
                    aria-label={intl.formatMessage({
                      defaultMessage: "Verified",
                      id: "GMglI5",
                      description:
                        "The email address has been verified to be owned by user",
                    })}
                  />
                )}
                <span>{workEmailFragment.workEmail}</span>
              </span>
            </Notice.Content>
          </Notice.Root>
        ) : (
          <span className="font-bold text-gray-600 dark:text-gray-100">
            {intl.formatMessage({
              defaultMessage: "No work email provided",
              id: "Qjaglb",
              description: "Error message when work email is null.",
            })}
          </span>
        )}
      </div>
      <Card.Separator space="xs" />
      <div className="flex flex-col items-center gap-3 xs:flex-row">
        <EmailVerificationDialog
          emailType={EmailType.Work}
          emailAddress={workEmailFragment.workEmail ?? null}
        >
          <Button mode="inline" className="text-center xs:text-left">
            {determineVerificationDialogText(
              intl,
              workEmailFragment.email,
              workEmailFragment.workEmail,
              workEmailFragment.isWorkEmailVerified,
            )}
          </Button>
        </EmailVerificationDialog>
        {workEmailFragment.id && workEmailFragment.workEmail && (
          <RemoveWorkEmailDialog
            id={workEmailFragment.id}
            workEmail={workEmailFragment.workEmail}
          />
        )}
      </div>
    </Card>
  );
};

export default GovernmentInformationCard;
