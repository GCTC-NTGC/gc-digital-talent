import React from "react";
import { useIntl } from "react-intl";
import { useQuery } from "urql";

import { Heading, Pending } from "@gc-digital-talent/ui";
import { useAuthorization, hasRole } from "@gc-digital-talent/auth";
import { User, graphql } from "@gc-digital-talent/graphql";

import SEO from "~/components/SEO/SEO";
import { getFullNameHtml } from "~/utils/nameUtils";
import useRoutes from "~/hooks/useRoutes";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import AdminHero from "~/components/Hero/AdminHero";
import {
  pageTitle as indexPoolPageTitle,
  pageSolidIcon as indexPoolPageIcon,
} from "~/pages/Pools/IndexPoolPage/navigation";
import {
  pageTitle as allPoolCandidatesPageTitle,
  pageSolidIcon as allPoolCandidatesPageIcon,
} from "~/pages/PoolCandidates/AllPoolCandidatesPage/navigation";
import {
  pageTitle as indexSearchRequestPageTitle,
  pageSolidIcon as indexSearchRequestPageIcon,
} from "~/pages/SearchRequests/IndexSearchRequestPage/navigation";
import {
  pageTitle as indexTeamPageTitle,
  pageSolidIcon as indexTeamPageIcon,
} from "~/pages/Teams/IndexTeamPage/navigation";
import {
  pageTitle as indexUserPageTitle,
  pageSolidIcon as indexUserPageIcon,
} from "~/pages/Users/IndexUserPage/navigation";
import { indexClassificationPageSolidIcon as indexClassificationPageIcon } from "~/pages/Classifications/navigation";
import { indexDepartmentPageSolidIcon as indexDepartmentPageIcon } from "~/pages/Departments/navigation";
import {
  indexSkillPageTitle,
  indexSkillPageSolidIcon as indexSkillPageIcon,
} from "~/pages/Skills/navigation";
import {
  indexSkillFamilyPageTitle,
  indexSkillFamilyPageSolidIcon as indexSkillFamilyPageIcon,
} from "~/pages/SkillFamilies/navigation";

import LinkWell from "./components/LinkWell";

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
        title={intl.formatMessage({
          defaultMessage: "Admin",
          id: "wHX/8C",
          description: "Title tag for Admin site",
        })}
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
              : intl.formatMessage({
                  defaultMessage: "N/A",
                  id: "AauSuA",
                  description: "Not available message.",
                }),
          },
        )}
        subtitle={intl.formatMessage({
          defaultMessage:
            "This is the administrator hub of the GC Digital Talent platform, manage, sort and recruit talent to the GoC.",
          id: "7nxtBm",
          description: "Subtitle for the admin dashboard page",
        })}
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

export default DashboardPageApi;
