import { useIntl } from "react-intl";

import { Button, Card } from "@gc-digital-talent/ui";
import {
  EmailType,
  FragmentType,
  getFragment,
  graphql,
} from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";
import { toast } from "@gc-digital-talent/toast";

import EmailVerificationDialog from "../EmailVerification/EmailVerificationDialog";
import EmailVerificationStatus from "../Profile/components/EmailVerificationStatus";

const ContactEmailCard_Fragment = graphql(/** GraphQL */ `
  fragment ContactEmailCard on User {
    id
    email
    isEmailVerified
  }
`);

interface ContactEmailCardProps {
  query: FragmentType<typeof ContactEmailCard_Fragment>;
}

const ContactEmailCard = ({ query }: ContactEmailCardProps) => {
  const intl = useIntl();
  const contactEmail = getFragment(ContactEmailCard_Fragment, query);

  return (
    <Card className="row-start-2 grid gap-3">
      <div className="flex min-h-8.5 flex-col justify-between gap-6">
        <p className="font-bold">{intl.formatMessage(commonMessages.email)}</p>
        <p className="text-sm text-gray-600 dark:text-gray-200">
          {intl.formatMessage({
            defaultMessage:
              "Adding and verifying a contact email will ensure that notifications are delivered to your inbox. It also acts as a point of contact for human resources staff and hiring managers.",
            id: "wmSeI8",
            description:
              "Contact email card description on account settings page",
          })}
        </p>
        <p>
          {contactEmail.email ? (
            <span className="flex gap-1.5">
              {contactEmail.isEmailVerified && (
                <EmailVerificationStatus
                  isEmailVerified={contactEmail.isEmailVerified}
                />
              )}
              <span>{contactEmail.email}</span>
            </span>
          ) : (
            <span className="font-bold text-error-600 dark:text-error-100">
              {intl.formatMessage({
                defaultMessage: "No contact email provided",
                id: "+z3V06",
                description: "Error message when contact email is null.",
              })}
            </span>
          )}
        </p>
      </div>
      <Card.Separator space="xs" />
      <EmailVerificationDialog
        defaultOpen={false}
        emailType={EmailType.Contact}
        emailAddress={contactEmail.email}
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

export default ContactEmailCard;
