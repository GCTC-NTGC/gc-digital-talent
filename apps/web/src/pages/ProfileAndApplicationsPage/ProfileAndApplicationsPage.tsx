import { useIntl } from "react-intl";
import { useQuery } from "urql";

import { ThrowNotFound, Pending } from "@gc-digital-talent/ui";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { navigationMessages } from "@gc-digital-talent/i18n";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";

import SEO from "~/components/SEO/SEO";
import profileMessages from "~/messages/profileMessages";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import permissionConstants from "~/constants/permissionConstants";

import ProfileAndApplicationsHeading from "./components/ProfileAndApplicationsHeading";
import TrackApplications from "./components/TrackApplications/TrackApplications";

export const ProfileAndApplicationsUser_Fragment = graphql(/* GraphQL */ `
  fragment ProfileAndApplicationsUser on User {
    id
    ...DashboardHeadingUser

    poolCandidates {
      ...TrackApplicationsCandidate
    }
  }
`);

interface ProfileAndApplicationsProps {
  userQuery: FragmentType<typeof ProfileAndApplicationsUser_Fragment>;
}

export const ProfileAndApplications = ({
  userQuery,
}: ProfileAndApplicationsProps) => {
  const intl = useIntl();
  const user = getFragment(ProfileAndApplicationsUser_Fragment, userQuery);

  return (
    <>
      <SEO
        title={intl.formatMessage(navigationMessages.profileAndApplications)}
        description={intl.formatMessage({
          defaultMessage:
            "Manage your personal information, career timeline, skills, and track applications.",
          id: "OyV6MH",
          description: "SEO description for profile and applications hero",
        })}
      />
      <ProfileAndApplicationsHeading userQuery={user} />
      <section data-h2-margin="base(x3, 0)">
        <div data-h2-wrapper="base(center, large, x1) p-tablet(center, large, x2)">
          <div id="track-applications-section">
            <TrackApplications
              applicationsQuery={unpackMaybes(user.poolCandidates)}
            />
          </div>
        </div>
      </section>
    </>
  );
};

const ProfileAndApplicationsApplicant_Query = graphql(/* GraphQL */ `
  query ProfileAndApplicationsApplicant {
    me {
      ...ProfileAndApplicationsUser
    }
  }
`);

const ProfileAndApplicationsPage = () => {
  const intl = useIntl();
  const [{ data, fetching, error }] = useQuery({
    query: ProfileAndApplicationsApplicant_Query,
  });

  return (
    <Pending fetching={fetching} error={error}>
      {data?.me ? (
        <ProfileAndApplications userQuery={data.me} />
      ) : (
        <ThrowNotFound
          message={intl.formatMessage(profileMessages.userNotFound)}
        />
      )}
    </Pending>
  );
};

export const Component = () => (
  <RequireAuth roles={permissionConstants.isApplicant}>
    <ProfileAndApplicationsPage />
  </RequireAuth>
);

Component.displayName = "ProfileAndApplicationsPage";

export default ProfileAndApplicationsPage;
