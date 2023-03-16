import React from "react";
import { useIntl } from "react-intl";

import { ThrowNotFound, Pending } from "@gc-digital-talent/ui";

import SEO from "~/components/SEO/SEO";
import { useGetMeQuery, User } from "~/api/generated";
import profileMessages from "~/messages/profileMessages";

import DashboardHeading from "./components/DashboardHeading";

interface ApplicantDashboardProps {
  user: User;
}

export const ApplicantDashboard = ({ user }: ApplicantDashboardProps) => {
  const intl = useIntl();

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
    </>
  );
};

const ApplicantDashboardPage = () => {
  const intl = useIntl();
  const [{ data, fetching, error }] = useGetMeQuery();

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
