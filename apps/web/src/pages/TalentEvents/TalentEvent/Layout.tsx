import { useIntl } from "react-intl";
import { Outlet } from "react-router";
import { useQuery } from "urql";

import { ROLE_NAME } from "@gc-digital-talent/auth";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { Pending, ThrowNotFound } from "@gc-digital-talent/ui";
import { commonMessages, navigationMessages } from "@gc-digital-talent/i18n";

import Hero from "~/components/Hero";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import SEO from "~/components/SEO/SEO";
import useRequiredParams from "~/hooks/useRequiredParams";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import useRoutes from "~/hooks/useRoutes";
import pageTitles from "~/messages/pageTitles";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";

import { RouteParams } from "./types";

const TalentEventLayout_Fragment = graphql(/* GraphQL */ `
  fragment TalentEventLayout on TalentNominationEvent {
    id
    name {
      localized
    }
  }
`);

interface LayoutProps {
  query: FragmentType<typeof TalentEventLayout_Fragment>;
}

const Layout = ({ query }: LayoutProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const { eventId } = useRequiredParams<RouteParams>("eventId");
  const talentEvent = getFragment(TalentEventLayout_Fragment, query);

  const pageTitle =
    talentEvent.name.localized ??
    intl.formatMessage(commonMessages.notAvailable);

  const description = intl.formatMessage({
    defaultMessage: "View event details and triage nominations.",
    id: "DbS8sT",
    description: "Description of a talent event",
  });

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(navigationMessages.communityDashboard),
        url: paths.communityDashboard(),
      },
      {
        label: intl.formatMessage(pageTitles.talentManagement),
        url: paths.adminTalentManagementEvents(),
      },
      {
        label: pageTitle,
        url: paths.adminTalentManagementEvent(eventId),
      },
    ],
  });

  return (
    <>
      <SEO title={pageTitle} description={description} />
      <Hero
        title={pageTitle}
        subtitle={description}
        crumbs={crumbs}
        navTabs={[
          {
            url: paths.adminTalentManagementEvent(eventId),
            label: intl.formatMessage({
              defaultMessage: "Event details",
              id: "jnd5HF",
              description: "Link text for details about a nomination event",
            }),
          },
          {
            url: paths.adminTalentManagementEventNominations(eventId),
            label: intl.formatMessage({
              defaultMessage: "Nominations",
              id: "tgPKAn",
              description:
                "Link text for the nominations of a specific talent nomination event",
            }),
          },
        ]}
      />
      <AdminContentWrapper>
        <Outlet />
      </AdminContentWrapper>
    </>
  );
};

const TalentEventLayout_Query = graphql(/* GraphQL */ `
  query TalentEventLayout($talentEventId: UUID!) {
    talentNominationEvent(id: $talentEventId) {
      ...TalentEventLayout
    }
  }
`);

const TalentEventLayout = () => {
  const { eventId } = useRequiredParams<RouteParams>("eventId");
  const [{ data, fetching, error }] = useQuery({
    query: TalentEventLayout_Query,
    variables: { talentEventId: eventId },
  });

  return (
    <Pending fetching={fetching} error={error}>
      {data?.talentNominationEvent ? (
        <Layout query={data.talentNominationEvent} />
      ) : (
        <ThrowNotFound />
      )}
    </Pending>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.CommunityTalentCoordinator]}>
    <TalentEventLayout />
  </RequireAuth>
);

Component.displayName = "TalentEventLayout";

export default Component;
