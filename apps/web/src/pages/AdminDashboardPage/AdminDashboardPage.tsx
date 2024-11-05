import { defineMessage, IntlShape, useIntl } from "react-intl";
import { useQuery } from "urql";
import RocketLaunchIcon from "@heroicons/react/24/outline/RocketLaunchIcon";
import BookOpenIcon from "@heroicons/react/20/solid/BookOpenIcon";
import ComputerDesktopIcon from "@heroicons/react/24/solid/ComputerDesktopIcon";
import Cog8ToothIcon from "@heroicons/react/20/solid/Cog8ToothIcon";

import {
  CardBasic,
  Chip,
  Chips,
  Heading,
  Link,
  Pending,
} from "@gc-digital-talent/ui";
import {
  useAuthorization,
  hasRole,
  ROLE_NAME,
  RoleName,
} from "@gc-digital-talent/auth";
import { Maybe, Role, User, graphql } from "@gc-digital-talent/graphql";
import {
  commonMessages,
  getLocalizedName,
  navigationMessages,
} from "@gc-digital-talent/i18n";
import { notEmpty, unpackMaybes } from "@gc-digital-talent/helpers";

import pageTitles from "~/messages/pageTitles";
import pageIcons from "~/utils/pageIcons";
import SEO from "~/components/SEO/SEO";
import { getFullNameHtml } from "~/utils/nameUtils";
import useRoutes from "~/hooks/useRoutes";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import AdminHero from "~/components/HeroDeprecated/AdminHero";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import adminMessages from "~/messages/adminMessages";

import LinkWell from "./components/LinkWell";
import { orderRoles } from "../Communities/CommunityMembersPage/helpers";

const subTitle = defineMessage({
  defaultMessage:
    "This is the administrator hub of the GC Digital Talent platform, manage, sort and recruit talent to the GoC.",
  id: "7nxtBm",
  description: "Subtitle for the admin dashboard page",
});

interface RoleChipsProps {
  roles: Maybe<Maybe<Role>[]>;
  intl: IntlShape;
}

const RoleChips = ({ roles, intl }: RoleChipsProps) => {
  const nonEmptyRoles = roles?.filter(notEmpty);
  const roleChips = nonEmptyRoles
    ? orderRoles(nonEmptyRoles, intl).map((role) => (
        <Chip color="secondary" key={role.id} data-h2-margin-right="base(x.5)">
          {getLocalizedName(role.displayName, intl)}
        </Chip>
      ))
    : null;

  return roleChips ? <Chips>{roleChips}</Chips> : null;
};

interface DashboardPageProps {
  currentUser?: User | null;
}

const DashboardPage = ({ currentUser }: DashboardPageProps) => {
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
      roles: [ROLE_NAME.PlatformAdmin],
    },
    {
      label: intl.formatMessage(navigationMessages.processes),
      href: adminRoutes.poolTable(),
      roles: [ROLE_NAME.PlatformAdmin],
    },
    {
      label: intl.formatMessage(pageTitles.talentRequests),
      href: adminRoutes.searchRequestTable(),
      roles: [ROLE_NAME.PlatformAdmin],
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
      roles: [ROLE_NAME.PlatformAdmin],
    },
    {
      label: intl.formatMessage({
        defaultMessage: "Job templates library",
        id: "S9N76A",
        description: "aaa",
      }),
      href: adminRoutes.jobPosterTemplates(),
      roles: [ROLE_NAME.PlatformAdmin],
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
      label: intl.formatMessage(pageTitles.teams),
      href: adminRoutes.teamTable(),
      roles: [ROLE_NAME.PlatformAdmin],
    },
    {
      label: intl.formatMessage(navigationMessages.users),
      href: adminRoutes.userTable(),
      roles: [ROLE_NAME.PlatformAdmin],
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

  // own roles
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
        <div
          data-h2-display="base(flex)"
          data-h2-flex-wrap="base(wrap)"
          data-h2-gap="base(x2 x5)"
        >
          <div>
            <Heading
              size="h4"
              data-h2-margin="base(0, 0, x1, 0)"
              Icon={RocketLaunchIcon}
            >
              {intl.formatMessage({
                defaultMessage: "Recruitment",
                id: "+Aytdn",
                description: "aaa",
              })}
            </Heading>
            <CardBasic>
              <ul>
                {recruitmentCollectionSorted.map((item) => (
                  <li key={item.label}>
                    <Link color="black" mode="inline" href={item.href}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </CardBasic>
          </div>
          <div>
            <Heading
              size="h4"
              data-h2-margin="base(0, 0, x1, 0)"
              Icon={BookOpenIcon}
            >
              {intl.formatMessage({
                defaultMessage: "Resources",
                id: "1M0pmT",
                description: "aaa",
              })}
            </Heading>
            <CardBasic>
              <ul>
                {resourcesCollectionSorted.map((item) => (
                  <li key={item.label}>
                    <Link color="black" mode="inline" href={item.href}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </CardBasic>
          </div>
          <div>
            <Heading
              size="h4"
              data-h2-margin="base(0, 0, x1, 0)"
              Icon={ComputerDesktopIcon}
            >
              {intl.formatMessage({
                defaultMessage: "Administration",
                id: "oHyv/S",
                description: "aaa",
              })}
            </Heading>
            <CardBasic>
              <ul>
                {administrationCollectionSorted.map((item) => (
                  <li key={item.label}>
                    <Link color="black" mode="inline" href={item.href}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </CardBasic>
          </div>
        </div>
        <div data-h2-margin-top="base(x2)">
          <Heading
            size="h4"
            data-h2-margin="base(0, 0, x1, 0)"
            Icon={Cog8ToothIcon}
          >
            {intl.formatMessage({
              defaultMessage: "Your roles",
              id: "8MlIqk",
              description: "aaa",
            })}
          </Heading>
          <RoleChips roles={ownRoles} intl={intl}></RoleChips>
        </div>
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
                {
                  // deviates from page title
                  label: intl.formatMessage({
                    defaultMessage: "Job templates",
                    id: "Ilg37j",
                    description: "Title for job templates",
                  }),
                  href: adminRoutes.jobPosterTemplates(),
                  icon: pageIcons.jobTemplates.solid,
                },
              ]}
            />
          )}
          {hasRole(
            ["request_responder", "community_recruiter", "community_admin"],
            roleAssignments,
          ) && (
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

export const DashboardPageApi = () => {
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
    <DashboardPageApi />
  </RequireAuth>
);

Component.displayName = "AdminDashboardPage";

export default DashboardPageApi;
