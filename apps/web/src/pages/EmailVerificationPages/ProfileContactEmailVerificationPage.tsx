import { useIntl } from "react-intl";
import { useNavigate, useSearchParams } from "react-router";

import { navigationMessages } from "@gc-digital-talent/i18n";
import { ROLE_NAME } from "@gc-digital-talent/auth";
import { EmailType } from "@gc-digital-talent/graphql";
import { Card, Container } from "@gc-digital-talent/ui";

// importing from a shared file, not the page itself
// eslint-disable-next-line no-restricted-imports
import profilePageMessages from "~/pages/Profile/ProfilePage/messages";
import Hero from "~/components/Hero";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import useRoutes from "~/hooks/useRoutes";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import EmailVerificationApi from "~/components/EmailVerification/EmailVerification";

import messages from "./messages";

const { pageTitle } = profilePageMessages;

const { subTitle } = profilePageMessages;

const ProfileContactEmailVerificationPage = () => {
  const intl = useIntl();
  const paths = useRoutes();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const emailAddress = searchParams.get("emailAddress");

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(navigationMessages.applicantDashboard),
        url: paths.applicantDashboard(),
      },
      {
        label: intl.formatMessage(profilePageMessages.pageTitle),
        url: paths.profile(),
      },
      {
        label: intl.formatMessage(messages.pageBreadcrumb),
        url: paths.verifyContactEmail(),
      },
    ],
  });

  const handleVerificationSuccess = async (): Promise<void> => {
    await navigate(paths.profile());
  };

  const handleSkip = async (): Promise<void> => {
    await navigate(paths.profile());
  };

  return (
    <>
      <Hero
        title={intl.formatMessage(pageTitle)}
        subtitle={intl.formatMessage(subTitle)}
        crumbs={crumbs}
      />
      <Container className="my-6">
        <Card>
          <EmailVerificationApi
            emailAddress={emailAddress}
            onVerificationSuccess={handleVerificationSuccess}
            emailType={EmailType.Contact}
            onSkip={handleSkip}
          />
        </Card>
      </Container>
    </>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.Applicant]}>
    <ProfileContactEmailVerificationPage />
  </RequireAuth>
);

Component.displayName = "ProfileContactEmailVerificationPage";

export default ProfileContactEmailVerificationPage;
