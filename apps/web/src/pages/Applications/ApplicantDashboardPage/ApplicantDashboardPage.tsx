import React from "react";
import { useIntl } from "react-intl";

import { ThrowNotFound, Pending } from "@gc-digital-talent/ui";
import { notEmpty } from "@gc-digital-talent/helpers";

import SEO from "~/components/SEO/SEO";
import { useApplicantInformationQuery } from "~/api/generated";
import profileMessages from "~/messages/profileMessages";

import DashboardHeading from "./components/DashboardHeading";
import TrackApplications from "./components/TrackApplications/TrackApplications";

import { PartialUser } from "./types";

interface ApplicantDashboardProps {
  user: PartialUser;
}

export const ApplicantDashboard = ({ user }: ApplicantDashboardProps) => {
  const intl = useIntl();
  const applications = user.poolCandidates?.filter(notEmpty) ?? [];

  return (
    <>
      <SEO
        title={intl.formatMessage({
          defaultMessage: "Dashboard",
          id: "2i8/jR",
          description: "Page title for the applicant dashboard page.",
        })}
      />
      <DashboardHeading user={user} />
      <section data-h2-margin="base(x3, 0)">
        <div data-h2-container="base(center, large, x1) p-tablet(center, large, x2)">
          <div id="track-applications-section">
            <TrackApplications applications={applications} />
          </div>
        </div>
      </section>
    </>
  );
};

const ApplicantDashboardPage = () => {
  const intl = useIntl();
  const [{ data, fetching, error }] = useApplicantInformationQuery();

  return (
    <Pending fetching={fetching} error={error}>
      {data?.me ? (
        <ApplicantDashboard user={data.me} />
      ) : (
        <ThrowNotFound
          message={intl.formatMessage(profileMessages.userNotFound)}
        />
      )}
    </Pending>
  );
};

export default ApplicantDashboardPage;
