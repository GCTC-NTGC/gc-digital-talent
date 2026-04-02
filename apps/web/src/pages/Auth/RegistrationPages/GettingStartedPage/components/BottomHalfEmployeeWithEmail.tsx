import { useIntl } from "react-intl";
import { useSearchParams } from "react-router";

import { Caption, Link, Notice, Separator } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";

import useRoutes from "~/hooks/useRoutes";

const BottomHalfEmployeeWithEmail = () => {
  const intl = useIntl();
  const paths = useRoutes();
  const [searchParams] = useSearchParams();
  const from = searchParams.get("from");
  return (
    <>
      <div className="mb-6">
        <Notice.Root color="success">
          <Notice.Title>
            {intl.formatMessage({
              defaultMessage:
                "The email provided by CanadaLogin is a verified work email",
              id: "stViWQ",
              description:
                "Title for a message that the work email address is verified",
            })}
          </Notice.Title>
          <Notice.Content>
            {intl.formatMessage({
              defaultMessage:
                "We’ll use this email address in conjunction with your current work experience to automatically verify your status as an employee.",
              id: "IBoqn2",
              description:
                "Title for a message that the work email address is verified",
            })}
          </Notice.Content>
        </Notice.Root>
      </div>
      <div className="mb-9">
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
        <Separator decorative orientation="horizontal" space="none" />
      </div>
      <div className="mt-6 flex flex-col items-center sm:flex-row sm:justify-end">
        <Link
          mode="solid"
          href={paths.registrationExperience({
            from: from ?? undefined,
            isEmployee: true,
          })}
        >
          {intl.formatMessage(commonMessages.saveAndContinue)}
        </Link>
      </div>
    </>
  );
};

export default BottomHalfEmployeeWithEmail;
