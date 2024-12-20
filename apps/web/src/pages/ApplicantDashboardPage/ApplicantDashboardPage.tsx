/* eslint-disable import/no-unused-modules */
import { useIntl } from "react-intl";
import { useQuery } from "urql";

import { Pending, Separator, ThrowNotFound } from "@gc-digital-talent/ui";
import { ROLE_NAME } from "@gc-digital-talent/auth";
import {
  getFragment,
  graphql,
  ReviewApplicationPreviewListFragment,
  ReviewRecruitmentProcessPreviewListFragment,
} from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import SEO from "~/components/SEO/SEO";
import { getFullNameHtml } from "~/utils/nameUtils";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import Hero from "~/components/Hero";

import ReviewApplicationPreviewList, {
  ReviewApplicationPreviewList_Fragment,
} from "./components/ReviewApplicationPreviewList";
import ReviewRecruitmentProcessPreviewList, {
  ReviewRecruitmentProcessPreviewList_Fragment,
} from "./components/ReviewRecruitmentProcessPreviewList";

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

  const applications = getFragment<ReviewApplicationPreviewListFragment>(
    ReviewApplicationPreviewList_Fragment,
    unpackMaybes(user?.poolCandidates),
  ); // TODO: filter by application statuses

  const recruitmentProcesses =
    getFragment<ReviewRecruitmentProcessPreviewListFragment>(
      ReviewRecruitmentProcessPreviewList_Fragment,
      unpackMaybes(user?.poolCandidates),
    ); // TODO: filter by recruitment process statuses

  return (
    <Pending fetching={fetching} error={error}>
      {!user ? (
        <ThrowNotFound />
      ) : (
        <>
          <SEO title={""} description={""} />
          <Hero
            title={intl.formatMessage(
              {
                defaultMessage: "Welcome back, {name}",
                id: "lIwJp4",
                description:
                  "Title for dashboard on the talent cloud admin portal.",
              },
              {
                name: user
                  ? getFullNameHtml(user.firstName, user.lastName, intl)
                  : intl.formatMessage(commonMessages.notAvailable),
              },
            )}
            subtitle={""}
          />
          <ReviewApplicationPreviewList applications={applications} />
          <Separator />
          <ReviewRecruitmentProcessPreviewList
            recruitmentProcesses={recruitmentProcesses}
          />
          <a href="#here">Here</a>
          <button type="button" id="here">
            Here
          </button>
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
