import { useIntl } from "react-intl";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "urql";

import { ROLE_NAME } from "@gc-digital-talent/auth";
import { graphql } from "@gc-digital-talent/graphql";

import Hero from "~/components/Hero";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import useRoutes from "~/hooks/useRoutes";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import EmailVerification from "~/components/EmailVerification/EmailVerification";

import messages from "./utils/messages";

const WorkEmailVerification_Query = graphql(/* GraphQL */ `
  query WorkEmailVerification {
    me {
      workEmail
    }
  }
`);

const RegistrationWorkEmailVerificationPage = () => {
  const intl = useIntl();
  const paths = useRoutes();
  const navigate = useNavigate();
  const [{ data }] = useQuery({
    query: WorkEmailVerification_Query,
  });

  const [searchParams] = useSearchParams();
  const from = searchParams.get("from");

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(messages.breadcrumb),
        url: paths.emailVerification(),
      },
    ],
  });

  const handleVerificationSuccess = (): void => {
    const navigationTarget = from || paths.profileAndApplications();
    navigate(navigationTarget);
  };

  const handleSkip = (): void => {
    const navigationTarget = from || paths.profileAndApplications();
    navigate(navigationTarget);
  };

  return (
    <Hero
      title={intl.formatMessage(messages.title)}
      subtitle={intl.formatMessage(messages.subtitle)}
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
          emailAddress={data?.me?.workEmail}
          onVerificationSuccess={handleVerificationSuccess}
          emailType="work"
          onSkip={handleSkip}
        />
      </div>
    </Hero>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.Applicant]}>
    <RegistrationWorkEmailVerificationPage />
  </RequireAuth>
);

export default RegistrationWorkEmailVerificationPage;