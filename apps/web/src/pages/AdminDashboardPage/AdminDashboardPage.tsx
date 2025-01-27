import { defineMessage, IntlShape, useIntl } from "react-intl";
import { useQuery } from "urql";
import RocketLaunchIcon from "@heroicons/react/24/outline/RocketLaunchIcon";
import BookOpenIcon from "@heroicons/react/24/outline/BookOpenIcon";
import ComputerDesktopIcon from "@heroicons/react/24/outline/ComputerDesktopIcon";
import CogIcon from "@heroicons/react/24/outline/CogIcon";
import uniqBy from "lodash/uniqBy";

import {
  CardBasic,
  Chip,
  Chips,
  Heading,
  Link,
  Pending,
} from "@gc-digital-talent/ui";
import { useAuthorization, hasRole, RoleName } from "@gc-digital-talent/auth";
import { Role, User, graphql } from "@gc-digital-talent/graphql";
import {
  commonMessages,
  getLocalizedName,
  navigationMessages,
} from "@gc-digital-talent/i18n";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import pageTitles from "~/messages/pageTitles";
import SEO from "~/components/SEO/SEO";
import { getFullNameHtml } from "~/utils/nameUtils";
import useRoutes from "~/hooks/useRoutes";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import adminMessages from "~/messages/adminMessages";
import permissionConstants from "~/constants/permissionConstants";
import Hero from "~/components/Hero";

import { orderRoles } from "../Communities/CommunityMembersPage/helpers";

const subTitle = defineMessage({
  defaultMessage:
    "This is the administrator hub of GC Digital Talent. Here you can recruit and manage talent, find resources, and adjust platform settings.",
  id: "0Wx0kW",
  description: "Subtitle for the admin dashboard page",
});

interface RoleChipsProps {
  roles: Role[];
  intl: IntlShape;
}

const RoleChips = ({ roles, intl }: RoleChipsProps) => {
  const uniqueRoles = uniqBy(roles, "name");
  const roleChips = uniqueRoles
    ? orderRoles(uniqueRoles, intl).map((role) => (
        <Chip color="warning" key={role.id} data-h2-margin-right="base(x.25)">
          {getLocalizedName(role.displayName, intl)}
        </Chip>
      ))
    : null;

  return roleChips ? <Chips>{roleChips}</Chips> : null;
};

export interface DashboardPageProps {
  currentUser?: User | null;
}

export const DashboardPage = ({ currentUser }: DashboardPageProps) => {
  const intl = useIntl();
  const adminRoutes = useRoutes();
  const { roleAssignments } = useAuthorization();

  interface CardLinkInfo {
    label: string;
    href: string;
    roles: RoleName[];
  }

  // recruitment section
  const recruitmentCollection: CardLinkInfo[] = [
    {
      label: intl.formatMessage(navigationMessages.candidates),
      href: adminRoutes.poolCandidates(),
      roles: permissionConstants.viewCandidates,
    },
    {
      label: intl.formatMessage(navigationMessages.processes),
      href: adminRoutes.poolTable(),
      roles: permissionConstants.viewProcesses,
    },
    {
      label: intl.formatMessage(pageTitles.talentRequests),
      href: adminRoutes.searchRequestTable(),
      roles: permissionConstants.viewRequests,
    },
  ];
  const recruitmentCollectionFiltered = recruitmentCollection.filter((item) =>
    hasRole(item.roles, roleAssignments),
  );
  const recruitmentCollectionSorted = recruitmentCollectionFiltered.sort(
    (a, b) => {
      const aName = a.label;
      const bName = b.label;
      return aName.localeCompare(bName);
    },
  );

  // resources section
  const resourcesCollection: CardLinkInfo[] = [
    {
      label: intl.formatMessage(navigationMessages.skillsLibrary),
      href: adminRoutes.skills(),
      roles: [],
    },
    {
      label: intl.formatMessage(navigationMessages.jobAdvertisementTemplates),
      href: adminRoutes.jobPosterTemplates(),
      roles: [],
    },
  ];
  const resourcesCollectionFiltered = resourcesCollection.filter((item) =>
    hasRole(item.roles, roleAssignments),
  );
  const resourcesCollectionSorted = resourcesCollectionFiltered.sort((a, b) => {
    const aName = a.label;
    const bName = b.label;
    return aName.localeCompare(bName);
  });

  // administration section
  const administrationCollection: CardLinkInfo[] = [
    {
      label: intl.formatMessage(pageTitles.announcements),
      href: adminRoutes.announcements(),
      roles: permissionConstants.managePlatformData,
    },
    {
      label: intl.formatMessage(adminMessages.classifications),
      href: adminRoutes.classificationTable(),
      roles: permissionConstants.managePlatformData,
    },
    {
      label: intl.formatMessage(adminMessages.departments),
      href: adminRoutes.departmentTable(),
      roles: permissionConstants.managePlatformData,
    },
    {
      label: intl.formatMessage(navigationMessages.skills),
      href: adminRoutes.skillTable(),
      roles: permissionConstants.managePlatformData,
    },
    {
      label: intl.formatMessage(adminMessages.skillFamilies),
      href: adminRoutes.skillFamilyTable(),
      roles: permissionConstants.managePlatformData,
    },
    {
      label: intl.formatMessage(pageTitles.trainingOpportunities),
      href: adminRoutes.trainingOpportunitiesIndex(),
      roles: permissionConstants.managePlatformData,
    },
    {
      label: intl.formatMessage(navigationMessages.users),
      href: adminRoutes.userTable(),
      roles: permissionConstants.viewUsers,
    },
    {
      label: intl.formatMessage(pageTitles.communities),
      href: adminRoutes.communityTable(),
      roles: permissionConstants.viewCommunities,
    },
    {
      label: intl.formatMessage(pageTitles.workStreams),
      href: adminRoutes.workStreamTable(),
      roles: permissionConstants.managePlatformData,
    },
  ];
  const administrationCollectionFiltered = administrationCollection.filter(
    (item) => hasRole(item.roles, roleAssignments),
  );
  const administrationCollectionSorted = administrationCollectionFiltered.sort(
    (a, b) => {
      const aName = a.label;
      const bName = b.label;
      return aName.localeCompare(bName);
    },
  );

  // own roles, filtered
  const ownRoles = unpackMaybes(roleAssignments)
    .map((roleAssign) => roleAssign.role)
    .filter((role) => !!role)
    .filter((role) => !["guest", "base_user", "applicant"].includes(role.name));

  return (
    <>
      <SEO
        title={intl.formatMessage(pageTitles.dashboard)}
        description={intl.formatMessage(subTitle)}
      />
      <Hero
        title={intl.formatMessage(
          {
            defaultMessage:
              "Welcome back<hidden> to your admin dashboard</hidden>, {name}",
            id: "utS0s1",
            description:
              "Title for admin dashboard on the talent cloud admin portal.",
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
        <div
          data-h2-display="base(flex)"
          data-h2-flex-wrap="base(wrap)"
          data-h2-gap="base(x2 x1.1)"
        >
          {recruitmentCollectionSorted.length > 0 && (
            <div>
              <Heading
                size="h4"
                data-h2-margin="base(0, 0, x1, 0)"
                Icon={RocketLaunchIcon}
                color="primary"
              >
                {intl.formatMessage({
                  defaultMessage: "Recruitment",
                  id: "UNEVD9",
                  description: "Header for section called recruitment",
                })}
              </Heading>
              <CardBasic data-h2-min-width="base(x14.5)">
                <ul data-h2-margin-bottom="base:children[li:not(:last-child)](x.5)">
                  {recruitmentCollectionSorted.map((item) => (
                    <li key={item.label}>
                      <Link color="primary" mode="inline" href={item.href}>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardBasic>
            </div>
          )}
          <div>
            <Heading
              size="h4"
              data-h2-margin="base(0, 0, x1, 0)"
              Icon={BookOpenIcon}
              color="secondary"
            >
              {intl.formatMessage({
                defaultMessage: "Resources",
                id: "nGSUzp",
                description: "Card title for a 'resources' card",
              })}
            </Heading>
            <CardBasic data-h2-min-width="base(x14.5)">
              <ul data-h2-margin-bottom="base:children[li:not(:last-child)](x.5)">
                {resourcesCollectionSorted.map((item) => (
                  <li key={item.label}>
                    <Link color="secondary" mode="inline" href={item.href}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </CardBasic>
          </div>
          {administrationCollectionSorted.length > 0 && (
            <div>
              <Heading
                size="h4"
                data-h2-margin="base(0, 0, x1, 0)"
                Icon={ComputerDesktopIcon}
                color="error"
              >
                {intl.formatMessage({
                  defaultMessage: "Administration",
                  id: "CdJQ7z",
                  description: "Header for section called administration",
                })}
              </Heading>
              <CardBasic data-h2-min-width="base(x14.5)">
                <ul data-h2-margin-bottom="base:children[li:not(:last-child)](x.5)">
                  {administrationCollectionSorted.map((item) => (
                    <li key={item.label}>
                      <Link color="error" mode="inline" href={item.href}>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardBasic>
            </div>
          )}
        </div>
        <div data-h2-margin-top="base(x3)" data-h2-margin-bottom="base(x2)">
          <Heading
            size="h4"
            data-h2-margin="base(0, 0, x1, 0)"
            Icon={CogIcon}
            color="warning"
          >
            {intl.formatMessage({
              defaultMessage: "Your roles",
              id: "IJlJF1",
              description:
                "Header for section displaying logged in user's roles",
            })}
          </Heading>
          <RoleChips roles={ownRoles} intl={intl}></RoleChips>
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

export const AdminDashboardPageApi = () => {
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
  <RequireAuth roles={permissionConstants.viewAdminDashboard}>
    <AdminDashboardPageApi />
  </RequireAuth>
);

Component.displayName = "AdminDashboardPage";
