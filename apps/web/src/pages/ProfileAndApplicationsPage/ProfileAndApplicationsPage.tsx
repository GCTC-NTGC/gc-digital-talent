import { useIntl } from "react-intl";
import { useQuery } from "urql";

import { ThrowNotFound, Pending, Loading } from "@gc-digital-talent/ui";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { navigationMessages } from "@gc-digital-talent/i18n";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import SEO from "~/components/SEO/SEO";
import profileMessages from "~/messages/profileMessages";
import RequireAuth from "~/components/RequireAuth/RequireAuth";

import ProfileAndApplicationsHeading from "./components/ProfileAndApplicationsHeading";
import TrackApplications from "./components/TrackApplications/TrackApplications";

const ProfileAndApplicationsApplicant_Query = graphql(/* GraphQL */ `
  query ProfileAndApplicationsApplicant {
    me {
      id
      ...DashboardHeadingUser

      poolCandidates {
        ...TrackApplicationsCandidate
      }
    }
  }
`);

export const ProfileAndApplicationsPage = () => {
  const intl = useIntl();
  const [{ data, fetching, error }] = useQuery({
    query: ProfileAndApplicationsApplicant_Query,
  });

  if (fetching || !data) return <Loading />;
  if (error)
    return (
      <ThrowNotFound
        message={intl.formatMessage(profileMessages.userNotFound)}
      />
    );

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
      {data?.me ? (
        <ProfileAndApplicationsHeading userQuery={data?.me} />
      ) : (
        <Loading />
      )}
      <section data-h2-margin="base(x3, 0)">
        <div data-h2-wrapper="base(center, large, x1) p-tablet(center, large, x2)">
          <div id="track-applications-section">
            {data?.me?.poolCandidates ? (
              <TrackApplications
                applicationsQuery={unpackMaybes(data?.me?.poolCandidates)}
              />
            ) : (
              <Loading />
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.Applicant]}>
    <ProfileAndApplicationsPage />
  </RequireAuth>
);

Component.displayName = "ProfileAndApplicationsPage";

export default ProfileAndApplicationsPage;
