import React from "react";
import { useIntl } from "react-intl";

import { ThrowNotFound, Pending } from "@gc-digital-talent/ui";
import { notEmpty } from "@gc-digital-talent/helpers";
import { navigationMessages } from "@gc-digital-talent/i18n";

import SEO from "~/components/SEO/SEO";
import { useApplicantInformationQuery } from "~/api/generated";
import profileMessages from "~/messages/profileMessages";

import ProfileAndApplicationsHeading from "./components/ProfileAndApplicationsHeading";
import TrackApplications from "./components/TrackApplications/TrackApplications";
import { PartialUser } from "./types";

interface ProfileAndApplicationsProps {
  user: PartialUser;
}

export const ProfileAndApplications = ({
  user,
}: ProfileAndApplicationsProps) => {
  const intl = useIntl();
  const applications = user.poolCandidates?.filter(notEmpty) ?? [];

  return (
    <>
      <SEO
        title={intl.formatMessage(navigationMessages.profileAndApplications)}
      />
      <ProfileAndApplicationsHeading user={user} />
      <section data-h2-margin="base(x3, 0)">
        <div data-h2-container="base(center, large, x1) p-tablet(center, large, x2)">
          <div id="track-applications-section">
            <TrackApplications applications={applications} userId={user.id} />
          </div>
        </div>
      </section>
    </>
  );
};

const ProfileAndApplicationsPage = () => {
  const intl = useIntl();
  const [{ data, fetching, error }] = useApplicantInformationQuery();

  return (
    <Pending fetching={fetching} error={error}>
      {data?.me ? (
        <ProfileAndApplications user={data.me} />
      ) : (
        <ThrowNotFound
          message={intl.formatMessage(profileMessages.userNotFound)}
        />
      )}
    </Pending>
  );
};

export default ProfileAndApplicationsPage;
