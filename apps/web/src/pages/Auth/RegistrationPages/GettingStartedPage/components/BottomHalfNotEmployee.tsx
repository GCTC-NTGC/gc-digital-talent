import { useIntl } from "react-intl";
import { useSearchParams } from "react-router";

import { Caption, Link, Separator } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";

import useRoutes from "~/hooks/useRoutes";

const BottomHalfNotEmployee = () => {
  const intl = useIntl();
  const paths = useRoutes();
  const [searchParams] = useSearchParams();
  const from = searchParams.get("from");
  return (
    <>
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
            isEmployee: false,
          })}
        >
          {intl.formatMessage(commonMessages.saveAndContinue)}
        </Link>
      </div>
    </>
  );
};

export default BottomHalfNotEmployee;
