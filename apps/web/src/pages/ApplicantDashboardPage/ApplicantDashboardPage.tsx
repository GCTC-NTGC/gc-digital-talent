/* eslint-disable import/no-unused-modules */
import { useIntl } from "react-intl";
import { useQuery } from "urql";

import { Pending, Separator, ThrowNotFound } from "@gc-digital-talent/ui";
import { ROLE_NAME } from "@gc-digital-talent/auth";
import { graphql } from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import SEO from "~/components/SEO/SEO";
import { getFullNameHtml } from "~/utils/nameUtils";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import Hero from "~/components/Hero";

import ReviewApplicationPreviewList from "./components/ReviewApplicationPreviewList";
import ReviewRecruitmentProcessPreviewList from "./components/ReviewRecruitmentProcessPreviewList";

const ApplicantDashboard_Query = graphql(/* GraphQL */ `
  query ApplicantDashboard {
    me {
      id
      firstName
      lastName
      poolCandidates {
        ...ReviewApplicationPreviewList
        ...ReviewRecruitmentProcessPreviewList
      }
    }
  }
`);

export const DashboardPage = () => {
  const intl = useIntl();

  const [{ data, fetching, error }] = useQuery({
    query: ApplicantDashboard_Query,
  });

  const user = data?.me;

  return (
    <Pending fetching={fetching} error={error}>
      {!user ? (
        <ThrowNotFound />
      ) : (
        <>
          <SEO />
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
                name: getFullNameHtml(user.firstName, user.lastName, intl),
              },
            )}
            subtitle={""}
          />
          <div data-h2-padding="base(x2)">
            <ReviewApplicationPreviewList
              applicationsQuery={unpackMaybes(user?.poolCandidates)}
            />
            <Separator />
            <ReviewRecruitmentProcessPreviewList
              recruitmentProcessesQuery={unpackMaybes(user?.poolCandidates)}
            />
          </div>
        </>
      )}
    </Pending>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.Applicant]}>
    <DashboardPage />
  </RequireAuth>
);

Component.displayName = "ApplicantDashboardPage";
