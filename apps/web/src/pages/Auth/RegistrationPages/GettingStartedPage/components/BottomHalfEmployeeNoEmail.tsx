import { useIntl } from "react-intl";
import { useSearchParams } from "react-router";

import { Link, Separator } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";
import { EmailType } from "@gc-digital-talent/graphql";

import Caption from "~/components/BasicInformation/Caption";
import useRoutes from "~/hooks/useRoutes";
import EmailVerification from "~/components/EmailVerification/EmailVerification";

const BottomHalfEmployeeNoEmail = ({
  initialWorkEmail,
}: {
  initialWorkEmail: string | null | undefined;
}) => {
  const intl = useIntl();
  const paths = useRoutes();
  const [searchParams] = useSearchParams();
  const from = searchParams.get("from");
  return (
    <>
      <div className="mb-6">
        {intl.formatMessage({
          defaultMessage:
            "Get a head start on gaining access to employee tools by verifying your work email. If you’re prefer, you can skip this step and verify your work email at a later time in your GC employee profile, accessed through your applicant dashboard.",
          id: "c8DrIs",
          description:
            "Description about verifying work email on the getting started page",
        })}
      </div>
      <div className="mb-6">
        <EmailVerification.RequestVerificationCodeForm
          emailType={EmailType.Work}
          emailAddress={initialWorkEmail ?? null}
        />
      </div>
      <div className="mb-6">
        <EmailVerification.RequestVerificationCodeContextMessage />
      </div>
      <div className="mb-6">
        <Caption>
          {intl.formatMessage({
            defaultMessage:
              "By registering and providing your email address, you agree to receive email communication from GC Digital Talent and its partner functional communities in the Government of Canada. You can control which types of notifications you receive and how you receive them in your account settings page.",
            id: "sHEsjv",
            description:
              "Message on getting started page about the contact email address",
          })}
        </Caption>
      </div>
      <div className="-mx-6 sm:-mx-9">
        <Separator decorative orientation="horizontal" />
      </div>
      <div className="flex flex-col items-center sm:flex-row sm:justify-end">
        <Link
          mode="solid"
          href={paths.registrationExperience({
            from: from ?? undefined,
            isEmployee: true,
          })}
        >
          {intl.formatMessage(commonMessages.continue)}
        </Link>
      </div>
    </>
  );
};

export default BottomHalfEmployeeNoEmail;
