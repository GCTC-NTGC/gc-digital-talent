import { useIntl } from "react-intl";
import { useNavigate, useSearchParams } from "react-router";
import { useQuery } from "urql";

import { ROLE_NAME } from "@gc-digital-talent/auth";
import { EmailType, graphql } from "@gc-digital-talent/graphql";
import { Card } from "@gc-digital-talent/ui";

import Hero from "~/components/Hero";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import useRoutes from "~/hooks/useRoutes";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import EmailVerificationApi from "~/components/EmailVerification/EmailVerification";

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

  const handleVerificationSuccess = async (): Promise<void> => {
    const navigationTarget = from ?? paths.applicantDashboard();
    await navigate(navigationTarget);
  };

  const handleSkip = async (): Promise<void> => {
    const navigationTarget = from ?? paths.applicantDashboard();
    await navigate(navigationTarget);
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
          emailAddress={data?.me?.workEmail}
          onVerificationSuccess={handleVerificationSuccess}
          emailType={EmailType.Work}
          onSkip={handleSkip}
        />
      </Card>
    </Hero>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.Applicant]}>
    <RegistrationWorkEmailVerificationPage />
  </RequireAuth>
);

export default RegistrationWorkEmailVerificationPage;
