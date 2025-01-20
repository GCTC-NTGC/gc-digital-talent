/* eslint-disable import/no-unused-modules */
import { useIntl } from "react-intl";
import { useQuery } from "urql";

import { CardBasic, Pending } from "@gc-digital-talent/ui";
import { ROLE_NAME } from "@gc-digital-talent/auth";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { navigationMessages } from "@gc-digital-talent/i18n";
import { BasicForm } from "@gc-digital-talent/forms";

import SEO from "~/components/SEO/SEO";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import Hero from "~/components/Hero";
import useRoutes from "~/hooks/useRoutes";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";

import { messages } from "./messages";
import FindANewCommunity, {
  SubformValues as FindANewCommunitySubformValues,
} from "../sections/FindANewCommunity";
import TrainingAndDevelopmentOpportunities, {
  SubformValues as TrainingAndDevelopmentOpportunitiesSubformValues,
} from "../sections/TrainingAndDevelopmentOpportunities";
import AdditionalInformation, {
  SubformValues as AdditionalInformationSubformValues,
} from "../sections/AdditionalInformation";
import ReviewAndSubmit, {
  SubformValues as ReviewAndSubmitSubformValues,
} from "../sections/ReviewAndSubmit";

const CreateCommunityInterest_Fragment = graphql(/* GraphQL */ `
  fragment CreateCommunityInterest_Fragment on Query {
    ...FindANewCommunityOptions_Fragment
    ...TrainingAndDevelopmentOpportunitiesOptions_Fragment
  }
`);

export interface FormValues
  extends FindANewCommunitySubformValues,
    TrainingAndDevelopmentOpportunitiesSubformValues,
    AdditionalInformationSubformValues,
    ReviewAndSubmitSubformValues {}

interface CreateCommunityInterestProps {
  query: FragmentType<typeof CreateCommunityInterest_Fragment>;
}

const CreateCommunityInterest = ({ query }: CreateCommunityInterestProps) => {
  const data = getFragment(CreateCommunityInterest_Fragment, query);
  return (
    <CardBasic
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(column)"
      data-h2-gap="base(x5)"
    >
      <BasicForm onSubmit={() => console.log("submitted")}>
        <FindANewCommunity
          optionsQuery={data}
          formDisabled={false} /* TODO: should be dynamic from urql */
        />
        <TrainingAndDevelopmentOpportunities
          optionsQuery={data}
          formDisabled={false} /* TODO: should be dynamic from urql */
        />
        <AdditionalInformation
          formDisabled={false} /* TODO: should be dynamic from urql */
        />
        <ReviewAndSubmit
          formDisabled={false} /* TODO: should be dynamic from urql */
        />
      </BasicForm>
    </CardBasic>
  );
};

const CreateCommunityInterestPage_Query = graphql(/* GraphQL */ `
  query CreateCommunityInterestPage_Query {
    ...CreateCommunityInterest_Fragment
  }
`);

export const CreateCommunityInterestPage = () => {
  const [{ data, fetching, error }] = useQuery({
    query: CreateCommunityInterestPage_Query,
  });
  const intl = useIntl();
  const routes = useRoutes();

  const formattedPageTitle = intl.formatMessage(messages.pageTitle);
  const formattedPageSubtitle = intl.formatMessage(messages.pageSubtitle);

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(navigationMessages.profileAndApplications),
        url: routes.applicantDashboard(),
      },

      {
        label: intl.formatMessage(messages.pageTitle),
        url: routes.createCommunityInterest(),
      },
    ],
  });

  return (
    <Pending fetching={fetching} error={error}>
      <SEO title={formattedPageTitle} description={formattedPageSubtitle} />
      <Hero
        title={formattedPageTitle}
        subtitle={formattedPageSubtitle}
        crumbs={crumbs}
        centered
        overlap
      >
        <div data-h2-margin-bottom="base(x3)">
          {data && <CreateCommunityInterest query={data} />}
        </div>
      </Hero>
    </Pending>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.Applicant]}>
    <CreateCommunityInterestPage />
  </RequireAuth>
);

Component.displayName = "CreateCommunityInterestPage";
