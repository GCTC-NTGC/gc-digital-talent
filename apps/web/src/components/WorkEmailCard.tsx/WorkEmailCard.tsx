import { useIntl } from "react-intl";
import CheckCircleIcon from "@heroicons/react/24/solid/CheckCircleIcon";

import { Button, Card } from "@gc-digital-talent/ui";
import {
  EmailType,
  FragmentType,
  getFragment,
  graphql,
} from "@gc-digital-talent/graphql";

import EmailVerificationDialog from "../EmailVerification/EmailVerificationDialog";

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
                <CheckCircleIcon
                  className="size-6 text-success"
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
          ) : (
            <span className="font-bold text-gray-600 dark:text-gray-100">
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
        emailType={EmailType.Work}
        emailAddress={workEmailFragment.workEmail}
      >
        <Button mode="inline" className="text-center xs:text-left">
          {intl.formatMessage({
            defaultMessage: "Verify a GC work email",
            id: "Vd9VIn",
            description: "Link to update the work email",
          })}
        </Button>
      </EmailVerificationDialog>
    </Card>
  );
};

export default WorkEmailCard;
