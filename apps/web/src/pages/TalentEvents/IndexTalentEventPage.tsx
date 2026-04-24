import { useIntl } from "react-intl";
import { useQuery } from "urql";

import { ROLE_NAME, useAuthorization } from "@gc-digital-talent/auth";
import { navigationMessages } from "@gc-digital-talent/i18n";
import { Pending } from "@gc-digital-talent/ui";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { graphql } from "@gc-digital-talent/graphql";

import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import pageTitles from "~/messages/pageTitles";
import Hero from "~/components/Hero";

import TalentEventTable from "./components/TalentEventTable";

const TalentEvents_Query = graphql(/* GraphQL */ `
  query TalentEvents($canManage: Boolean) {
    talentNominationEvents(where: { canManage: $canManage }) {
      id
      ...TalentEventTableRow
    }
  }
`);

export const IndexTalentEventPage = () => {
  const intl = useIntl();
  const routes = useRoutes();
  const { userAuthInfo } = useAuthorization();

  const pageTitle = intl.formatMessage(pageTitles.talentManagement);
  const pageSubtitle = intl.formatMessage({
    defaultMessage:
      "View a summary of all talent management events and their status.",
    id: "w6GbHK",
    description: "Subtitle for talent event table",
  });

  const navigationCrumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(navigationMessages.communityDashboard),
        url: routes.communityDashboard(),
      },
      {
        label: pageTitle,
        url: routes.adminTalentManagementEvents(),
      },
    ],
  });

  const isPlatformAdmin =
    userAuthInfo?.roleAssignments?.some(
      (roleAssignment) =>
        roleAssignment?.role?.name === ROLE_NAME.PlatformAdmin,
    ) ?? false;

  const [{ data, fetching, error }] = useQuery({
    query: TalentEvents_Query,
    variables: { canManage: !isPlatformAdmin },
  });

  return (
    <>
      <SEO title={pageTitle} />
      <Hero
        title={pageTitle}
        subtitle={pageSubtitle}
        crumbs={navigationCrumbs}
      />
      <AdminContentWrapper table>
        <Pending fetching={fetching} error={error}>
          <TalentEventTable
            talentNominationEventQuery={unpackMaybes(
              data?.talentNominationEvents,
            )}
            title={pageTitle}
          />
        </Pending>
      </AdminContentWrapper>
    </>
  );
};

export const Component = () => (
  <RequireAuth
    roles={[ROLE_NAME.CommunityTalentCoordinator, ROLE_NAME.PlatformAdmin]}
  >
    <IndexTalentEventPage />
  </RequireAuth>
);

Component.displayName = "AdminIndexTalentEventPage";

export default Component;
