/* eslint-disable import/no-unused-modules */
import { useIntl } from "react-intl";
import { useQuery } from "urql";

import { Pending } from "@gc-digital-talent/ui";
import { User, graphql } from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";

import SEO from "~/components/SEO/SEO";
import { getFullNameHtml } from "~/utils/nameUtils";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import Hero from "~/components/Hero";
import permissionConstants from "~/constants/permissionConstants";

export interface DashboardPageProps {
  currentUser?: User | null;
}

export const DashboardPage = ({ currentUser }: DashboardPageProps) => {
  const intl = useIntl();

  return (
    <>
      <SEO title={""} description={""} />
      <Hero
        title={intl.formatMessage(
          {
            defaultMessage:
              "Welcome back<hidden> to your applicant dashboard</hidden>, {name}",
            id: "bw4CAS",
            description:
              "Title for applicant dashboard on the talent cloud admin portal.",
          },
          {
            name: currentUser
              ? getFullNameHtml(
                  currentUser.firstName,
                  currentUser.lastName,
                  intl,
                )
              : intl.formatMessage(commonMessages.notAvailable),
          },
        )}
        subtitle={""}
      />
    </>
  );
};

const ApplicantDashboard_Query = graphql(/* GraphQL */ `
  query ApplicantDashboard_Query {
    me {
      id
      firstName
      lastName
    }
  }
`);

export const ApplicantDashboardPageApi = () => {
  const [{ data, fetching, error }] = useQuery({
    query: ApplicantDashboard_Query,
  });

  return (
    <Pending fetching={fetching} error={error}>
      <DashboardPage currentUser={data?.me} />
    </Pending>
  );
};

export const Component = () => (
  <RequireAuth roles={permissionConstants().isApplicant}>
    <ApplicantDashboardPageApi />
  </RequireAuth>
);

Component.displayName = "ApplicantDashboardPage";
