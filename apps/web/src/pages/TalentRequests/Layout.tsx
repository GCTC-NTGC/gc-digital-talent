import { useIntl } from "react-intl";
import { Outlet, useLocation } from "react-router";
import { useQuery } from "urql";

import {
  getFragment,
  graphql,
  type FragmentType,
} from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";
import {
  Container,
  Pending,
  Sidebar,
  ThrowNotFound,
} from "@gc-digital-talent/ui";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import useRoutes from "~/hooks/useRoutes";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import pageTitles from "~/messages/pageTitles";
import SEO from "~/components/SEO/SEO";
import Hero from "~/components/Hero";
import adminMessages from "~/messages/adminMessages";
import useRequiredParams from "~/hooks/useRequiredParams";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import talentRequestMessages from "~/messages/talentRequestMessages";

import TalentRequestSidebar from "./components/TalentRequestSidebar";
import type { RouteParams } from "./types";
import type { TalentRequestStatusOptions } from "./components/TalentRequestStatusDialog";

const TalentRequestLayout_Fragment = graphql(/** GraphQL */ `
  fragment TalentRequestLayout on TalentRequest {
    id
    jobTitle
    fullName
    department {
      name {
        localized
      }
    }

    ...TalentRequestSidebar
  }
`);

interface LayoutProps {
  query: FragmentType<typeof TalentRequestLayout_Fragment>;
  optionsQuery: TalentRequestStatusOptions;
}

const Layout = ({ query, optionsQuery }: LayoutProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const location = useLocation();
  const talentRequest = getFragment(TalentRequestLayout_Fragment, query);
  const isTrackingRoute =
    location.pathname === paths.talentRequestTracking(talentRequest.id);

  const pageTitle =
    talentRequest.jobTitle ?? intl.formatMessage(commonMessages.notFound);
  const description = intl.formatMessage(
    {
      defaultMessage: "{fullName}'s request from {department}",
      description: "Subtitle for a talent request",
      id: "/2Lr1r",
    },
    {
      fullName: talentRequest.fullName,
      department:
        talentRequest.department?.name.localized ??
        intl.formatMessage(commonMessages.notAvailable),
    },
  );

  const crumbsConfig = [
    {
      label: intl.formatMessage(pageTitles.talentRequests),
      url: paths.talentRequests(),
    },
    {
      label: pageTitle,
      url: paths.talentRequestView(talentRequest.id),
    },
  ];

  if (isTrackingRoute) {
    crumbsConfig.push({
      label: intl.formatMessage(talentRequestMessages.candidateTracking),
      url: paths.talentRequestTracking(talentRequest.id),
    });
  }

  const crumbs = useBreadcrumbs({ crumbs: crumbsConfig });

  return (
    <>
      <SEO title={pageTitle} description={description} />
      <Hero
        title={pageTitle}
        subtitle={description}
        crumbs={crumbs}
        navTabs={[
          {
            label: intl.formatMessage(adminMessages.details),
            url: paths.talentRequestView(talentRequest.id),
          },
          {
            label: intl.formatMessage(talentRequestMessages.candidateTracking),
            url: paths.talentRequestTracking(talentRequest.id),
          },
        ]}
      />
      <Container size="lg" className="my-18">
        <Sidebar.Wrapper className="sm:gap-x-6">
          <Sidebar.Sidebar>
            <TalentRequestSidebar
              query={talentRequest}
              optionsQuery={optionsQuery}
            />
          </Sidebar.Sidebar>
          <Sidebar.Content>
            <Outlet />
          </Sidebar.Content>
        </Sidebar.Wrapper>
      </Container>
    </>
  );
};

const TalentRequestLayout_Query = graphql(/** GraphQL */ `
  query TalentRequestLayout($id: UUID!) {
    talentRequest(id: $id) {
      ...TalentRequestLayout
    }

    ...TalentRequestStatusOptions
  }
`);

const TalentRequestLayout = () => {
  const { talentRequestId } = useRequiredParams<RouteParams>("talentRequestId");
  const [{ data, fetching, error }] = useQuery({
    query: TalentRequestLayout_Query,
    variables: { id: talentRequestId },
  });

  return (
    <Pending fetching={fetching} error={error}>
      {data?.talentRequest ? (
        <Layout query={data.talentRequest} optionsQuery={data} />
      ) : (
        <ThrowNotFound />
      )}
    </Pending>
  );
};

export const Component = () => {
  return (
    <RequireAuth
      roles={[ROLE_NAME.CommunityRecruiter, ROLE_NAME.CommunityAdmin]}
    >
      <TalentRequestLayout />
    </RequireAuth>
  );
};

Component.displayName = "AdminTalentRequestLayout";

export default Component;
