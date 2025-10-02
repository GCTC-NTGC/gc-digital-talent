import { useIntl } from "react-intl";

import { Button, Card } from "@gc-digital-talent/ui";
import {
  EmailType,
  FragmentType,
  getFragment,
  graphql,
} from "@gc-digital-talent/graphql";
import { toast } from "@gc-digital-talent/toast";

import EmailVerificationDialog from "../EmailVerification/EmailVerificationDialog";
import EmailVerificationStatus from "../Profile/components/EmailVerificationStatus";

const WorkEmailCard_Fragment = graphql(/** GraphQL */ `
  fragment WorkEmailCard on User {
    id
    workEmail
    isWorkEmailVerified
  }
`);

interface WorkEmailCardProps {
  query: FragmentType<typeof WorkEmailCard_Fragment>;
}

const WorkEmailCard = ({ query }: WorkEmailCardProps) => {
  const intl = useIntl();
  const workEmailFragment = getFragment(WorkEmailCard_Fragment, query);

  return (
    <Card className="row-start-3 grid gap-3 xs:row-start-2">
      <div className="flex min-h-8.5 flex-col justify-between gap-6">
        <p className="font-bold">
          {intl.formatMessage({
            defaultMessage: "Government of Canada work email",
            id: "LvXaIZ",
            description: "Label for gov of canada work email",
          })}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-200">
          {intl.formatMessage({
            defaultMessage:
              "If you're a Government of Canada employee, verifying your work email and adding your current role to your career experience will give you access to employee tools.",
            id: "0dAZ6V",
            description:
              "Gov of canada work email card description on account settings page",
          })}
        </p>
        <p>
          {workEmailFragment.workEmail ? (
            <span className="flex gap-1.5">
              {workEmailFragment.isWorkEmailVerified && (
                <EmailVerificationStatus
                  isEmailVerified={workEmailFragment.isWorkEmailVerified}
                />
              )}
              <span>{workEmailFragment.workEmail}</span>
            </span>
          ) : (
            <span className="font-bold text-gray-600">
              {intl.formatMessage({
                defaultMessage: "No work email provided",
                id: "Qjaglb",
                description: "Error message when work email is null.",
              })}
            </span>
          )}
        </p>
      </div>
      <Card.Separator space="xs" />
      <EmailVerificationDialog
        defaultOpen={false}
        emailType={EmailType.Contact}
        emailAddress={workEmailFragment.workEmail}
        onVerificationSuccess={function (): void {
          toast.info("EmailVerificationDialog contact onVerificationSuccess");
        }}
      >
        <Button mode="inline" className="max-w-max text-left">
          {intl.formatMessage({
            defaultMessage: "Update contact email",
            id: "Xc3Y7t",
            description: "Link to update the contact email",
          })}
        </Button>
      </EmailVerificationDialog>
    </Card>
  );
};

export default WorkEmailCard;
