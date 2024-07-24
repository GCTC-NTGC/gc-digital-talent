import { defineMessage, useIntl } from "react-intl";
import { useQuery } from "urql";

import { Heading, Pending } from "@gc-digital-talent/ui";
import { useAuthorization, hasRole, ROLE_NAME } from "@gc-digital-talent/auth";
import { User, graphql } from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";

import pageTitles from "~/messages/pageTitles";
import pageIcons from "~/utils/pageIcons";
import SEO from "~/components/SEO/SEO";
import { getFullNameHtml } from "~/utils/nameUtils";
import useRoutes from "~/hooks/useRoutes";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import AdminHero from "~/components/Hero/AdminHero";
import RequireAuth from "~/components/RequireAuth/RequireAuth";

import LinkWell from "./components/LinkWell";

const subTitle = defineMessage({
  defaultMessage:
    "This is the administrator hub of the GC Digital Talent platform, manage, sort and recruit talent to the GoC.",
  id: "7nxtBm",
  description: "Subtitle for the admin dashboard page",
});

interface DashboardPageProps {
  currentUser?: User | null;
}

const DashboardPage = ({ currentUser }: DashboardPageProps) => {
  const intl = useIntl();
  const adminRoutes = useRoutes();
  const { roleAssignments } = useAuthorization();

  return (
    <>
      <SEO
        title={intl.formatMessage(pageTitles.dashboard)}
        description={intl.formatMessage(subTitle)}
      />
      <AdminHero
        title={intl.formatMessage(
          {
            defaultMessage: "Welcome back, {name}",
            id: "lIwJp4",
            description:
              "Title for dashboard on the talent cloud admin portal.",
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
        subtitle={intl.formatMessage(subTitle)}
      />
      <AdminContentWrapper>
        <Heading
          size="h4"
          data-h2-font-weight="base(bold)"
          data-h2-margin="base(0, 0, x1, 0)"
        >
          {intl.formatMessage({
            defaultMessage: "What are you working on today?",
            id: "wHnGAK",
            description:
              "Heading for the sections of links available to the current user",
          })}
        </Heading>
        <div
          data-h2-display="base(flex)"
          data-h2-flex-direction="base(column)"
          data-h2-gap="base(x1, 0)"
        >
          {hasRole("pool_operator", roleAssignments) && (
            <LinkWell
              title={intl.formatMessage({
                defaultMessage: "Managing a recruitment process",
                id: "293bsq",
                description: "Heading for pool operator dashboard links",
              })}
              links={[
                {
                  label: intl.formatMessage(pageTitles.processes),
                  href: adminRoutes.poolTable(),
                  icon: pageIcons.processes.solid,
                },
                {
                  label: intl.formatMessage(pageTitles.candidateSearch),
                  href: adminRoutes.poolCandidates(),
                  icon: pageIcons.poolCandidates.solid,
                },
                {
                  label: intl.formatMessage(pageTitles.users),
                  href: adminRoutes.userTable(),
                  icon: pageIcons.users.solid,
                },
                {
                  // deviates from page title
                  label: intl.formatMessage({
                    defaultMessage: "My Teams",
                    id: "N3uD4m",
                    description: "Link text for current users teams page",
                  }),
                  href: adminRoutes.teamTable(),
                  icon: pageIcons.teams.solid,
                },
                {
                  label: intl.formatMessage(pageTitles.skillsList),
                  href: adminRoutes.skills(),
                  icon: pageIcons.skillsList.solid,
                },
              ]}
            />
          )}
          {hasRole("request_responder", roleAssignments) && (
            <LinkWell
              title={intl.formatMessage({
                defaultMessage: "Responding to talent requests",
                id: "ijUT7N",
                description: "Heading for request responder dashboard links",
              })}
              links={[
                {
                  label: intl.formatMessage(pageTitles.talentRequests),
                  href: adminRoutes.searchRequestTable(),
                  icon: pageIcons.talentRequests.solid,
                },
                {
                  label: intl.formatMessage(pageTitles.candidateSearch),
                  href: adminRoutes.poolCandidates(),
                  icon: pageIcons.poolCandidates.solid,
                },
                {
                  label: intl.formatMessage(pageTitles.users),
                  href: adminRoutes.userTable(),
                  icon: pageIcons.users.solid,
                },
              ]}
            />
          )}
          {hasRole("community_manager", roleAssignments) && (
            <LinkWell
              title={intl.formatMessage({
                defaultMessage: "Publishing pools and managing teams",
                id: "B29+yd",
                description: "Heading for Community Manager dashboard links",
              })}
              links={[
                {
                  label: intl.formatMessage(pageTitles.processes),
                  href: adminRoutes.poolTable(),
                  icon: pageIcons.processes.solid,
                },
                {
                  label: intl.formatMessage(pageTitles.communities),
                  href: adminRoutes.communityTable(),
                  icon: pageIcons.communities.solid,
                },
                {
                  label: intl.formatMessage(pageTitles.teams),
                  href: adminRoutes.teamTable(),
                  icon: pageIcons.teams.solid,
                },
              ]}
            />
          )}
          {hasRole("platform_admin", roleAssignments) && (
            <LinkWell
              title={intl.formatMessage({
                defaultMessage: "Maintaining the platform",
                id: "ipSk4R",
                description: "Heading for platform dashboard links",
              })}
              links={[
                {
                  label: intl.formatMessage(pageTitles.users),
                  href: adminRoutes.userTable(),
                  icon: pageIcons.users.solid,
                },
                {
                  label: intl.formatMessage(pageTitles.communities),
                  href: adminRoutes.communityTable(),
                  icon: pageIcons.communities.solid,
                },
                {
                  label: intl.formatMessage(pageTitles.teams),
                  href: adminRoutes.teamTable(),
                  icon: pageIcons.teams.solid,
                },
                {
                  // deviates from page title
                  label: intl.formatMessage({
                    defaultMessage: "Departments and Agencies",
                    id: "hxaIWa",
                    description: "Link text for all departments page",
                  }),
                  href: adminRoutes.departmentTable(),
                  icon: pageIcons.departments.solid,
                },
                {
                  label: intl.formatMessage(pageTitles.skillsEditor),
                  href: adminRoutes.skillTable(),
                  icon: pageIcons.skillsEditor.solid,
                },
                {
                  label: intl.formatMessage(pageTitles.skillFamilies),
                  href: adminRoutes.skillFamilyTable(),
                  icon: pageIcons.skillFamilies.solid,
                },
                {
                  // deviates from page title
                  label: intl.formatMessage({
                    defaultMessage: "Groups and Classifications",
                    id: "m4hoPL",
                    description: "Link text for all classifications page",
                  }),
                  href: adminRoutes.classificationTable(),
                  icon: pageIcons.classifications.solid,
                },
                {
                  label: intl.formatMessage(pageTitles.announcements),
                  href: adminRoutes.announcements(),
                  icon: pageIcons.announcements.solid,
                },
              ]}
            />
          )}
        </div>
      </AdminContentWrapper>
    </>
  );
};

const AdminDashboard_Query = graphql(/* GraphQL */ `
  query AdminDashboard_Query {
    me {
      id
      firstName
      lastName
    }
  }
`);

const DashboardPageApi = () => {
  const [{ data, fetching, error }] = useQuery({
    query: AdminDashboard_Query,
  });

  return (
    <Pending fetching={fetching} error={error}>
      <DashboardPage currentUser={data?.me} />
    </Pending>
  );
};

export const Component = () => (
  <RequireAuth
    roles={[
      ROLE_NAME.PoolOperator,
      ROLE_NAME.RequestResponder,
      ROLE_NAME.CommunityManager,
      ROLE_NAME.PlatformAdmin,
    ]}
  >
    <DashboardPageApi />
  </RequireAuth>
);

Component.displayName = "AdminDashboardPage";

export default DashboardPageApi;
