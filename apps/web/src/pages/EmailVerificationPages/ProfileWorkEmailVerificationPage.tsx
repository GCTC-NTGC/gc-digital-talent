import { useIntl } from "react-intl";
import { useNavigate } from "react-router";
import { useQuery } from "urql";

import { navigationMessages } from "@gc-digital-talent/i18n";
import { ROLE_NAME } from "@gc-digital-talent/auth";
import { EmailType, graphql } from "@gc-digital-talent/graphql";

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

const WorkEmailVerification_Query = graphql(/* GraphQL */ `
  query WorkEmailVerification {
    me {
      workEmail
    }
  }
`);

const ProfileWorkEmailVerificationPage = () => {
  const intl = useIntl();
  const paths = useRoutes();
  const navigate = useNavigate();
  const [{ data }] = useQuery({
    query: WorkEmailVerification_Query,
  });

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
        url: paths.verifyWorkEmail(),
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
      <div
        data-h2-wrapper="base(center, large, x1) p-tablet(center, large, x2)"
        data-h2-padding="base(x1, 0)"
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
      </div>
    </>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.Applicant]}>
    <ProfileWorkEmailVerificationPage />
  </RequireAuth>
);

Component.displayName = "ProfileWorkEmailVerificationPage";

export default ProfileWorkEmailVerificationPage;
