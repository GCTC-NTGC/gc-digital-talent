/* eslint-disable import/no-unused-modules */
import { useIntl } from "react-intl";
import { useQuery } from "urql";

import { CardBasic, Pending } from "@gc-digital-talent/ui";
import { ROLE_NAME } from "@gc-digital-talent/auth";
import { User, graphql } from "@gc-digital-talent/graphql";
import { navigationMessages } from "@gc-digital-talent/i18n";

import SEO from "~/components/SEO/SEO";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import Hero from "~/components/Hero";
import useRoutes from "~/hooks/useRoutes";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";

import FindANewCommunity from "../sections/FindANewCommunity";
import TrainingAndDevelopmentOpportunities from "../sections/TrainingAndDevelopmentOpportunities";
import AdditionalInformation from "../sections/AdditionalInformation";
import { messages } from "./messages";

const UpdateCommunityInterest = () => {
  return (
    <CardBasic>
      <FindANewCommunity />
      <TrainingAndDevelopmentOpportunities />
      <AdditionalInformation />
    </CardBasic>
  );
};

export interface UpdateCommunityInterestPageProps {
  currentUser?: User | null;
}

export const UpdateCommunityInterestPage = ({
  currentUser,
}: UpdateCommunityInterestPageProps) => {
  const intl = useIntl();
  const routes = useRoutes();

  const formattedLongPageTitle = intl.formatMessage(messages.longPageTitle);
  const formattedShortPageTitle = intl.formatMessage(messages.shortPageTitle);
  const formattedPageSubtitle = intl.formatMessage(messages.pageSubtitle);

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(navigationMessages.profileAndApplications),
        url: routes.applicantDashboard(),
      },

      {
        label: intl.formatMessage(messages.shortPageTitle),
        url: routes.updateCommunityInterest("TODO"),
      },
    ],
  });

  return (
    <>
      <SEO
        title={formattedShortPageTitle}
        description={formattedPageSubtitle}
      />
      <Hero
        title={formattedLongPageTitle}
        subtitle={formattedPageSubtitle}
        crumbs={crumbs}
        centered
        overlap
      >
        <div data-h2-margin-bottom="base(x3)">
          <UpdateCommunityInterest />
        </div>
      </Hero>
    </>
  );
};

const UpdateCommunityInterest_Query = graphql(/* GraphQL */ `
  query UpdateCommunityInterest_Query {
    me {
      id
      firstName
      lastName
    }
  }
`);

export const UpdateCommunityInterestPageApi = () => {
  const [{ data, fetching, error }] = useQuery({
    query: UpdateCommunityInterest_Query,
  });

  return (
    <Pending fetching={fetching} error={error}>
      <UpdateCommunityInterestPage currentUser={data?.me} />
    </Pending>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.Applicant]}>
    <UpdateCommunityInterestPageApi />
  </RequireAuth>
);

Component.displayName = "UpdateCommunityInterestPage";
