import { useIntl } from "react-intl";
import { createSearchParams, useNavigate, useSearchParams } from "react-router";

import { ROLE_NAME } from "@gc-digital-talent/auth";
import { EmailType } from "@gc-digital-talent/graphql";
import { Card } from "@gc-digital-talent/ui";

import Hero from "~/components/Hero";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import useRoutes from "~/hooks/useRoutes";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import EmailVerificationApi from "~/components/EmailVerification/EmailVerification";

import messages from "./utils/messages";

const RegistrationContactEmailVerificationPage = () => {
  const intl = useIntl();
  const paths = useRoutes();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const emailAddress = searchParams.get("emailAddress");
  const from = searchParams.get("from");

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(messages.breadcrumb),
        url: paths.emailVerification(),
      },
    ],
  });

  const handleVerificationSuccess = async (): Promise<void> => {
    await navigate({
      pathname: paths.employeeInformation(),
      search: from ? createSearchParams({ from }).toString() : "",
    });
  };

  const handleSkip = async (): Promise<void> => {
    await navigate({
      pathname: paths.employeeInformation(),
      search: from ? createSearchParams({ from }).toString() : "",
    });
  };

  return (
    <Hero
      title={intl.formatMessage(messages.title)}
      subtitle={intl.formatMessage(messages.subtitle)}
      crumbs={crumbs}
      overlap
    >
      <Card>
        <EmailVerificationApi
          emailAddress={emailAddress}
          onVerificationSuccess={handleVerificationSuccess}
          emailType={EmailType.Contact}
          onSkip={handleSkip}
        />
      </Card>
    </Hero>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.Applicant]}>
    <RegistrationContactEmailVerificationPage />
  </RequireAuth>
);

export default RegistrationContactEmailVerificationPage;
