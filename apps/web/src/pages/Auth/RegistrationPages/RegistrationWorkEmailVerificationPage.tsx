import { useIntl } from "react-intl";
import { useNavigate, useSearchParams } from "react-router";
import { useQuery } from "urql";

import { EmailType, graphql } from "@gc-digital-talent/graphql";

import Hero from "~/components/Hero";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import useRoutes from "~/hooks/useRoutes";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import EmailVerificationApi from "~/components/EmailVerification/EmailVerification";
import permissionConstants from "~/constants/permissionConstants";

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
    const navigationTarget = from ?? paths.profileAndApplications();
    await navigate(navigationTarget);
  };

  const handleSkip = async (): Promise<void> => {
    const navigationTarget = from ?? paths.profileAndApplications();
    await navigate(navigationTarget);
  };

  return (
    <Hero
      title={intl.formatMessage(messages.title)}
      subtitle={intl.formatMessage(messages.subtitle)}
      crumbs={crumbs}
      overlap
    >
      <div
        data-h2-padding="base(x2) "
        data-h2-background="base(foreground)"
        data-h2-radius="p-tablet(rounded)"
        data-h2-shadow="base(large)"
      >
        <EmailVerificationApi
          emailAddress={data?.me?.workEmail}
          onVerificationSuccess={handleVerificationSuccess}
          emailType={EmailType.Work}
          onSkip={handleSkip}
        />
      </div>
    </Hero>
  );
};

export const Component = () => (
  <RequireAuth roles={permissionConstants().isApplicant}>
    <RegistrationWorkEmailVerificationPage />
  </RequireAuth>
);

export default RegistrationWorkEmailVerificationPage;
