import { defineMessage, IntlShape, useIntl } from "react-intl";
import { useQuery } from "urql";
import RocketLaunchIcon from "@heroicons/react/24/outline/RocketLaunchIcon";
import BookOpenIcon from "@heroicons/react/24/outline/BookOpenIcon";
import ComputerDesktopIcon from "@heroicons/react/24/outline/ComputerDesktopIcon";
import CogIcon from "@heroicons/react/24/outline/CogIcon";
import uniqBy from "lodash/uniqBy";

import {
  Card,
  Chip,
  Chips,
  Container,
  Heading,
  Link,
  Pending,
  Ul,
} from "@gc-digital-talent/ui";
import {
  useAuthorization,
  hasRole,
  ROLE_NAME,
  RoleName,
} from "@gc-digital-talent/auth";
import {
  Maybe,
  Role,
  RoleAssignment,
  User,
  graphql,
} from "@gc-digital-talent/graphql";
import {
  commonMessages,
  getLocalizedName,
  navigationMessages,
} from "@gc-digital-talent/i18n";
import { sortAlphaBy, unpackMaybes } from "@gc-digital-talent/helpers";

import pageTitles from "~/messages/pageTitles";
import SEO from "~/components/SEO/SEO";
import { getFullNameHtml } from "~/utils/nameUtils";
import useRoutes from "~/hooks/useRoutes";
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

// short-circuit hasRole if no roles were required so an empty array
const hasRolesHandleNoRolesRequired = (
  checkRole: RoleName | RoleName[],
  userRoles: Maybe<(Maybe<RoleAssignment> | undefined)[]> | undefined,
): boolean => {
  if (Array.isArray(checkRole) && checkRole.length === 0) {
    return true;
  }
  return hasRole(checkRole, userRoles);
};

const RoleChips = ({ roles, intl }: RoleChipsProps) => {
  const uniqueRoles = uniqBy(roles, "name");
  const roleChips = uniqueRoles
    ? orderRoles(uniqueRoles, intl).map((role) => (
        <Chip color="warning" key={role.id} className="mr-1.5">
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
    {
      label: intl.formatMessage(adminMessages.communityTalent),
      href: adminRoutes.communityTalentPage(),
      roles: permissionConstants.viewCommunityTalent,
    },
    {
      label: intl.formatMessage(pageTitles.workforceAdjustment),
      href: adminRoutes.workforceAdjustmentEmployees(),
      roles: permissionConstants.viewWorkforceAdjustment,
    },
  ];
  const recruitmentCollectionFiltered = recruitmentCollection.filter((item) =>
    hasRolesHandleNoRolesRequired(item.roles, roleAssignments),
  );
  const recruitmentCollectionSorted = recruitmentCollectionFiltered.sort(
    sortAlphaBy((item) => item.label),
  );

  // resources section
  const resourcesCollection: CardLinkInfo[] = [
    {
      label: intl.formatMessage(navigationMessages.skillsLibrary),
      href: adminRoutes.skills(),
      roles: [],
    },
    {
      label: intl.formatMessage(navigationMessages.jobTemplatesLibrary),
      href: adminRoutes.jobPosterTemplates(),
      roles: [],
    },
  ];
  const resourcesCollectionFiltered = resourcesCollection.filter((item) =>
    hasRolesHandleNoRolesRequired(item.roles, roleAssignments),
  );
  const resourcesCollectionSorted = resourcesCollectionFiltered.sort(
    sortAlphaBy((item) => item.label),
  );

  // administration section
  const administrationCollection: CardLinkInfo[] = [
    {
      label: intl.formatMessage(pageTitles.announcements),
      href: adminRoutes.announcements(),
      roles: [ROLE_NAME.PlatformAdmin],
    },
    {
      label: intl.formatMessage(adminMessages.classifications),
      href: adminRoutes.classificationTable(),
      roles: [ROLE_NAME.PlatformAdmin],
    },
    {
      label: intl.formatMessage(adminMessages.departments),
      href: adminRoutes.departmentTable(),
      roles: [ROLE_NAME.PlatformAdmin],
    },
    {
      label: intl.formatMessage(adminMessages.rolesAndPermissions),
      href: adminRoutes.rolesAndPermissions(),
      roles: [
        ROLE_NAME.PlatformAdmin,
        ROLE_NAME.CommunityTalentCoordinator,
        ROLE_NAME.CommunityRecruiter,
        ROLE_NAME.CommunityAdmin,
      ],
    },
    {
      label: intl.formatMessage(navigationMessages.skills),
      href: adminRoutes.skillTable(),
      roles: [ROLE_NAME.PlatformAdmin],
    },
    {
      label: intl.formatMessage(adminMessages.skillFamilies),
      href: adminRoutes.skillFamilyTable(),
      roles: [ROLE_NAME.PlatformAdmin],
    },
    {
      label: intl.formatMessage(pageTitles.trainingOpportunities),
      href: adminRoutes.trainingOpportunitiesIndex(),
      roles: [ROLE_NAME.PlatformAdmin],
    },
    {
      label: intl.formatMessage(navigationMessages.users),
      href: adminRoutes.userTable(),
      roles: permissionConstants.viewUsers,
    },
    {
      label: intl.formatMessage(pageTitles.communities),
      href: adminRoutes.communityTable(),
      roles: [
        ROLE_NAME.CommunityAdmin,
        ROLE_NAME.CommunityRecruiter,
        ROLE_NAME.PlatformAdmin,
      ],
    },
    {
      label: intl.formatMessage(pageTitles.workStreams),
      href: adminRoutes.workStreamTable(),
      roles: [ROLE_NAME.PlatformAdmin],
    },
    {
      label: intl.formatMessage(navigationMessages.jobTemplatesTable),
      href: adminRoutes.jobPosterTemplateTable(),
      roles: [ROLE_NAME.PlatformAdmin],
    },
  ];
  const administrationCollectionFiltered = administrationCollection.filter(
    (item) => hasRolesHandleNoRolesRequired(item.roles, roleAssignments),
  );
  const administrationCollectionSorted = administrationCollectionFiltered.sort(
    sortAlphaBy((item) => item.label),
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
      <Container className="my-18">
        <div className="grid gap-x-6 gap-y-12 xs:grid-cols-3">
          {recruitmentCollectionSorted.length > 0 && (
            <div>
              <Heading
                size="h4"
                className="mt-0 mb-6"
                icon={RocketLaunchIcon}
                color="secondary"
              >
                {intl.formatMessage({
                  defaultMessage: "Recruitment",
                  id: "UNEVD9",
                  description: "Header for section called recruitment",
                })}
              </Heading>
              <Card>
                <Ul space="lg">
                  {recruitmentCollectionSorted.map((item) => (
                    <li key={item.label}>
                      <Link color="secondary" mode="inline" href={item.href}>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </Ul>
              </Card>
            </div>
          )}
          <div>
            <Heading
              size="h4"
              icon={BookOpenIcon}
              color="primary"
              className="mt-0 mb-6"
            >
              {intl.formatMessage({
                defaultMessage: "Resources",
                id: "nGSUzp",
                description: "Card title for a 'resources' card",
              })}
            </Heading>
            <Card>
              <Ul space="lg">
                {resourcesCollectionSorted.map((item) => (
                  <li key={item.label}>
                    <Link color="primary" mode="inline" href={item.href}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </Ul>
            </Card>
          </div>
          {administrationCollectionSorted.length > 0 && (
            <div>
              <Heading
                size="h4"
                icon={ComputerDesktopIcon}
                color="error"
                className="mt-0 mb-6"
              >
                {intl.formatMessage({
                  defaultMessage: "Administration",
                  id: "CdJQ7z",
                  description: "Header for section called administration",
                })}
              </Heading>
              <Card>
                <Ul space="lg">
                  {administrationCollectionSorted.map((item) => (
                    <li key={item.label}>
                      <Link color="error" mode="inline" href={item.href}>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </Ul>
              </Card>
            </div>
          )}
        </div>
        <div className="mt-18 mb-12">
          <Heading
            size="h4"
            icon={CogIcon}
            color="warning"
            className="mt-0 mb-6"
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
      </Container>
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
  <RequireAuth roles={[ROLE_NAME.PlatformAdmin]}>
    <AdminDashboardPageApi />
  </RequireAuth>
);

Component.displayName = "AdminDashboardPage";

export default Component;
