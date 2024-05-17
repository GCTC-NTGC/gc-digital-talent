import { defineMessage, useIntl } from "react-intl";
import { useQuery } from "urql";
import HomeOutlineIcon from "@heroicons/react/24/outline/HomeIcon";
import HomeSolidIcon from "@heroicons/react/24/solid/HomeIcon";

import { Heading, Pending, IconType } from "@gc-digital-talent/ui";
import { useAuthorization, hasRole, ROLE_NAME } from "@gc-digital-talent/auth";
import { User, graphql } from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";

import SEO from "~/components/SEO/SEO";
import { getFullNameHtml } from "~/utils/nameUtils";
import useRoutes from "~/hooks/useRoutes";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import AdminHero from "~/components/Hero/AdminHero";
import {
  pageTitle as indexPoolPageTitle,
  pageSolidIcon as indexPoolPageIcon,
} from "~/pages/Pools/IndexPoolPage/IndexPoolPage";
import {
  pageTitle as allPoolCandidatesPageTitle,
  pageSolidIcon as allPoolCandidatesPageIcon,
} from "~/pages/PoolCandidates/AllPoolCandidatesPage/AllPoolCandidatesPage";
import {
  pageTitle as indexSearchRequestPageTitle,
  pageSolidIcon as indexSearchRequestPageIcon,
} from "~/pages/SearchRequests/IndexSearchRequestPage/IndexSearchRequestPage";
import {
  pageTitle as indexTeamPageTitle,
  pageSolidIcon as indexTeamPageIcon,
} from "~/pages/Teams/IndexTeamPage/IndexTeamPage";
import {
  pageTitle as indexUserPageTitle,
  pageSolidIcon as indexUserPageIcon,
} from "~/pages/Users/IndexUserPage/IndexUserPage";
import { pageSolidIcon as indexClassificationPageIcon } from "~/pages/Classifications/IndexClassificationPage";
import { pageSolidIcon as indexDepartmentPageIcon } from "~/pages/Departments/IndexDepartmentPage";
import {
  pageTitle as indexSkillPageTitle,
  pageSolidIcon as indexSkillPageIcon,
} from "~/pages/Skills/IndexSkillPage";
import {
  pageTitle as indexSkillFamilyPageTitle,
  pageSolidIcon as indexSkillFamilyPageIcon,
} from "~/pages/SkillFamilies/IndexSkillFamilyPage";
import {
  pageTitle as announcementsPageTitle,
  pageSolidIcon as announcementsPageIcon,
} from "~/pages/AnnouncementsPage/AnnouncementsPage";
import {
  adminPageTitle as skillPageTitle,
  pageSolidIcon as skillPageIcon,
} from "~/pages/Skills/SkillPage";
import RequireAuth from "~/components/RequireAuth/RequireAuth";

import LinkWell from "./components/LinkWell";

export const pageTitle = defineMessage({
  defaultMessage: "Dashboard",
  id: "ArwIQV",
  description: "Title for dashboard",
});
const subTitle = defineMessage({
  defaultMessage:
    "This is the administrator hub of the GC Digital Talent platform, manage, sort and recruit talent to the GoC.",
  id: "7nxtBm",
  description: "Subtitle for the admin dashboard page",
});

export const pageOutlineIcon: IconType = HomeOutlineIcon;
export const pageSolidIcon: IconType = HomeSolidIcon;
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
        title={intl.formatMessage(pageTitle)}
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
        <Heading size="h4" className="mb-6 mt-0 font-bold">
          {intl.formatMessage({
            defaultMessage: "What are you working on today?",
            id: "wHnGAK",
            description:
              "Heading for the sections of links available to the current user",
          })}
        </Heading>
        <div className="flex flex-col gap-y-6">
          {hasRole("pool_operator", roleAssignments) && (
            <LinkWell
              title={intl.formatMessage({
                defaultMessage: "Managing a recruitment process",
                id: "293bsq",
                description: "Heading for pool operator dashboard links",
              })}
              links={[
                {
                  label: intl.formatMessage(indexPoolPageTitle),
                  href: adminRoutes.poolTable(),
                  icon: indexPoolPageIcon,
                },
                {
                  label: intl.formatMessage(allPoolCandidatesPageTitle),
                  href: adminRoutes.poolCandidates(),
                  icon: allPoolCandidatesPageIcon,
                },
                {
                  label: intl.formatMessage(indexUserPageTitle),
                  href: adminRoutes.userTable(),
                  icon: indexUserPageIcon,
                },
                {
                  // deviates from page title
                  label: intl.formatMessage({
                    defaultMessage: "My Teams",
                    id: "N3uD4m",
                    description: "Link text for current users teams page",
                  }),
                  href: adminRoutes.teamTable(),
                  icon: indexTeamPageIcon,
                },
                {
                  label: intl.formatMessage(skillPageTitle),
                  href: adminRoutes.skills(),
                  icon: skillPageIcon,
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
                  label: intl.formatMessage(indexSearchRequestPageTitle),
                  href: adminRoutes.searchRequestTable(),
                  icon: indexSearchRequestPageIcon,
                },
                {
                  label: intl.formatMessage(allPoolCandidatesPageTitle),
                  href: adminRoutes.poolCandidates(),
                  icon: allPoolCandidatesPageIcon,
                },
                {
                  label: intl.formatMessage(indexUserPageTitle),
                  href: adminRoutes.userTable(),
                  icon: indexUserPageIcon,
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
                  label: intl.formatMessage(indexPoolPageTitle),
                  href: adminRoutes.poolTable(),
                  icon: indexPoolPageIcon,
                },
                {
                  label: intl.formatMessage(indexTeamPageTitle),
                  href: adminRoutes.teamTable(),
                  icon: indexTeamPageIcon,
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
                  label: intl.formatMessage(indexUserPageTitle),
                  href: adminRoutes.userTable(),
                  icon: indexUserPageIcon,
                },
                {
                  label: intl.formatMessage(indexTeamPageTitle),
                  href: adminRoutes.teamTable(),
                  icon: indexTeamPageIcon,
                },
                {
                  // deviates from page title
                  label: intl.formatMessage({
                    defaultMessage: "Departments and Agencies",
                    id: "hxaIWa",
                    description: "Link text for all departments page",
                  }),
                  href: adminRoutes.departmentTable(),
                  icon: indexDepartmentPageIcon,
                },
                {
                  label: intl.formatMessage(indexSkillPageTitle),
                  href: adminRoutes.skillTable(),
                  icon: indexSkillPageIcon,
                },
                {
                  label: intl.formatMessage(indexSkillFamilyPageTitle),
                  href: adminRoutes.skillFamilyTable(),
                  icon: indexSkillFamilyPageIcon,
                },
                {
                  // deviates from page title
                  label: intl.formatMessage({
                    defaultMessage: "Groups and Classifications",
                    id: "m4hoPL",
                    description: "Link text for all classifications page",
                  }),
                  href: adminRoutes.classificationTable(),
                  icon: indexClassificationPageIcon,
                },
                {
                  label: intl.formatMessage(announcementsPageTitle),
                  href: adminRoutes.announcements(),
                  icon: announcementsPageIcon,
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
