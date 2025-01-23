import { useIntl } from "react-intl";
import { useNavigate, useSearchParams } from "react-router";

import { navigationMessages } from "@gc-digital-talent/i18n";
import { EmailType } from "@gc-digital-talent/graphql";

// importing from a shared file, not the page itself
// eslint-disable-next-line no-restricted-imports
import profilePageMessages from "~/pages/Profile/ProfilePage/messages";
import Hero from "~/components/Hero";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import useRoutes from "~/hooks/useRoutes";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import EmailVerificationApi from "~/components/EmailVerification/EmailVerification";
import permissionConstants from "~/constants/permissionConstants";

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
        label: intl.formatMessage(navigationMessages.profileAndApplications),
        url: paths.profileAndApplications(),
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
            emailAddress={emailAddress}
            onVerificationSuccess={handleVerificationSuccess}
            emailType={EmailType.Contact}
            onSkip={handleSkip}
          />
        </div>
      </div>
    </>
  );
};

export const Component = () => (
  <RequireAuth roles={permissionConstants.isApplicant}>
    <ProfileContactEmailVerificationPage />
  </RequireAuth>
);

Component.displayName = "ProfileContactEmailVerificationPage";

export default ProfileContactEmailVerificationPage;
