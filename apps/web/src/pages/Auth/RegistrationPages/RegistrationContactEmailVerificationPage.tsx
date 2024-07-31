import { defineMessage, useIntl } from "react-intl";
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import { ROLE_NAME } from "@gc-digital-talent/auth";

import Hero from "~/components/Hero";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import useRoutes from "~/hooks/useRoutes";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import EmailVerification from "~/components/EmailVerification/EmailVerification";

const title = defineMessage({
  defaultMessage: "Registration",
  id: "VJjjnE",
  description: "Page title for the registration pages",
});
const subTitle = defineMessage({
  defaultMessage: "Get started by completing your basic account information.",
  id: "lkPTWR",
  description: "Subtitle for the create account page for applicant profiles.",
});

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
        label: intl.formatMessage(title),
        url: paths.emailVerification(),
      },
    ],
  });

  const handleVerificationSuccess = (): void => {
    navigate({
      pathname: paths.employeeRegistration(),
      search: from ? createSearchParams({ from }).toString() : "",
    });
  };

  const handleSkip = (): void => {
    navigate({
      pathname: paths.employeeRegistration(),
      search: from ? createSearchParams({ from }).toString() : "",
    });
  };

  return (
    <Hero
      title={intl.formatMessage({
        defaultMessage: "Welcome to GC Digital Talent",
        id: "WVTDgX",
        description:
          "Title for the create account page for applicant profiles.",
      })}
      subtitle={intl.formatMessage(subTitle)}
      crumbs={crumbs}
      simpleCrumbs
    >
      <div
        data-h2-padding="base(x2) "
        data-h2-background="base(foreground)"
        data-h2-radius="p-tablet(rounded)"
        data-h2-shadow="base(large)"
      >
        <EmailVerification
          emailAddress={emailAddress}
          onVerificationSuccess={handleVerificationSuccess}
          emailType="contact"
          onSkip={handleSkip}
        />
      </div>
    </Hero>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.Applicant]}>
    <RegistrationContactEmailVerificationPage />
  </RequireAuth>
);

export default RegistrationContactEmailVerificationPage;
