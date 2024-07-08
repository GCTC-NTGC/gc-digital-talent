import { useIntl } from "react-intl";

import { navigationMessages, getLocale } from "@gc-digital-talent/i18n";
import { ROLE_NAME } from "@gc-digital-talent/auth";

// importing from a shared file, not the page itself
// eslint-disable-next-line no-restricted-imports
import profilePageMessages from "~/pages/Profile/ProfilePage/messages";
import Hero from "~/components/Hero";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import useRoutes from "~/hooks/useRoutes";
import RequireAuth from "~/components/RequireAuth/RequireAuth";

import messages from "./messages";

const { pageTitle } = profilePageMessages;

const { subTitle } = profilePageMessages;

const ProfileEmailVerificationPage = () => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = useRoutes();

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
        url: paths.profileEmailVerification(),
      },
    ],
  });

  return (
    <>
      <Hero
        title={intl.formatMessage(pageTitle)}
        subtitle={intl.formatMessage(subTitle)}
        crumbs={crumbs}
      />
      <div data-h2-padding="base(x3, 0)">
        <div
          data-h2-container="base(center, large, x1) p-tablet(center, large, x2)"
          data-h2-margin="base:children[p:not(:first-child), ul](x1, 0, 0, 0)"
        />
      </div>
    </>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.Applicant]}>
    <ProfileEmailVerificationPage />
  </RequireAuth>
);

Component.displayName = "ProfileEmailVerificationPage";

export default ProfileEmailVerificationPage;
