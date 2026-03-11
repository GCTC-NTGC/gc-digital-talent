import { useIntl } from "react-intl";
import { OperationContext, useQuery } from "urql";

import {
  Pending,
  ResourceBlock,
  NotFound,
  Container,
} from "@gc-digital-talent/ui";
import { ROLE_NAME } from "@gc-digital-talent/auth";
import {
  graphql,
  getFragment,
  DepartmentDashboardQuery,
} from "@gc-digital-talent/graphql";
import { commonMessages, navigationMessages } from "@gc-digital-talent/i18n";
import { NotFoundError, unpackMaybes } from "@gc-digital-talent/helpers";

import useRoutes from "~/hooks/useRoutes";
import SEO from "~/components/SEO/SEO";
import { getFullNameHtml } from "~/utils/nameUtils";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import Hero from "~/components/Hero";
import messages from "~/messages/profileMessages";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";

import DepartmentToolsTaskCard from "./components/DepartmentToolsTaskCard";
import ResourcesDepartmentLink from "./components/ResourcesDepartmentLink";
import {
  departmentAssignmentsToDepartmentRolesObjects,
  isDepartmentTeamable,
  RoleAssignmentObject,
} from "./utils";

export const DepartmentDashboardPage_Fragment = graphql(/* GraphQL */ `
  fragment DepartmentDashboardPage on User {
    id
    firstName
    lastName
    authInfo {
      roleAssignments {
        role {
          name
          displayName {
            localized
          }
        }
        teamable {
          ... on Department {
            id
            name {
              localized
            }
          }
        }
      }
    }
    ...DepartmentToolsTaskCard
  }
`);

interface DashboardPageProps {
  departmentDashboardQuery: DepartmentDashboardQuery;
}

export const DashboardPage = ({
  departmentDashboardQuery,
}: DashboardPageProps) => {
  const intl = useIntl();
  const paths = useRoutes();

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(navigationMessages.departmentDashboard),
        url: paths.departmentDashboard(),
      },
    ],
  });

  const currentUser = getFragment(
    DepartmentDashboardPage_Fragment,
    departmentDashboardQuery.me,
  );

  if (!currentUser) {
    throw new NotFoundError();
  }

  const myRoleAssignments = unpackMaybes(currentUser.authInfo?.roleAssignments);
  const departmentAssignments: RoleAssignmentObject[] = myRoleAssignments.map(
    (roleAssign) => {
      if (isDepartmentTeamable(roleAssign.teamable)) {
        return {
          role: roleAssign.role,
          teamable: {
            id: roleAssign.teamable.id,
            name: roleAssign.teamable.name,
          },
        };
      }

      return {
        role: null,
        teamable: null,
      };
    },
  );
  const departmentRolesObjectArray =
    departmentAssignmentsToDepartmentRolesObjects(departmentAssignments, intl);

  return (
    <>
      <SEO
        title={intl.formatMessage(navigationMessages.departmentDashboard)}
        description={intl.formatMessage({
          defaultMessage:
            "This is your department dashboard where you can recruit and manage talent, and find resources.",
          id: "3aiz1p",
          description: "Subtitle for the department dashboard page",
        })}
      />
      <Hero
        title={intl.formatMessage(
          {
            defaultMessage:
              "Welcome back<hidden> to your department dashboard</hidden>, {name}",
            id: "78k3CS",
            description: "Title for department dashboard on the admin portal.",
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
        subtitle={intl.formatMessage({
          defaultMessage:
            "This is your department dashboard where you can recruit and manage talent, and find resources.",
          id: "3aiz1p",
          description: "Subtitle for the department dashboard page",
        })}
        crumbs={crumbs}
      />
      <section className="my-18">
        <Container>
          <div className="flex flex-col gap-6 xs:flex-row">
            <div className="flex flex-col gap-6">
              <DepartmentToolsTaskCard
                departmentToolsTaskCardQuery={currentUser}
              />
            </div>
            <div className="flex shrink-0 flex-col gap-6 xs:max-w-84">
              <ResourceBlock.Root
                headingColor="warning"
                headingAs="h2"
                title={intl.formatMessage({
                  defaultMessage: "Your account",
                  id: "CBedVL",
                  description: "Nav menu trigger for account links sub menu",
                })}
              >
                {departmentRolesObjectArray.map((departmentRolesObject) => (
                  <ResourcesDepartmentLink
                    key={departmentRolesObject.departmentId}
                    departmentWithRoles={departmentRolesObject}
                  />
                ))}
              </ResourceBlock.Root>
              <ResourceBlock.Root
                headingColor="error"
                headingAs="h2"
                title={intl.formatMessage({
                  defaultMessage: "Resources",
                  id: "nGSUzp",
                  description: "Card title for a 'resources' card",
                })}
              >
                <ResourceBlock.SingleLinkItem
                  as="h3"
                  title={intl.formatMessage({
                    defaultMessage: "Learn about skills",
                    id: "n40Nry",
                    description: "Link for the 'learn about skills' card",
                  })}
                  href={paths.skills()}
                  description={intl.formatMessage({
                    defaultMessage:
                      "Browse a complete list of available skills and learn how they’re organized.",
                    id: "mluvY2",
                    description: "the 'Learn about skills' tool description",
                  })}
                />
                <ResourceBlock.SingleLinkItem
                  as="h3"
                  title={intl.formatMessage({
                    defaultMessage: "Contact support",
                    id: "jRnA1D",
                    description: "Link for the 'contact support' card",
                  })}
                  href={paths.support()}
                  description={intl.formatMessage({
                    defaultMessage:
                      "Questions or need help? Get in touch with our support team and let us know how we can help.",
                    id: "s8ByY4",
                    description: "the 'contact support' tool description",
                  })}
                />
              </ResourceBlock.Root>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
};

const context: Partial<OperationContext> = {
  additionalTypenames: [
    "PoolCandidateSearchRequest",
    "OffPlatformRecruitmentProcess",
  ],
};

const DepartmentDashboard_Query = graphql(/* GraphQL */ `
  query DepartmentDashboard {
    me {
      ...DepartmentDashboardPage
    }
  }
`);

export const DepartmentDashboardPageApi = () => {
  const intl = useIntl();
  const [{ data, fetching, error }] = useQuery({
    query: DepartmentDashboard_Query,
    context,
  });

  return (
    <Pending fetching={fetching} error={error}>
      {data?.me ? (
        <DashboardPage departmentDashboardQuery={data} />
      ) : (
        <NotFound headingMessage={intl.formatMessage(commonMessages.notFound)}>
          <p>{intl.formatMessage(messages.userNotFound)}</p>
        </NotFound>
      )}
    </Pending>
  );
};

export const Component = () => (
  <RequireAuth
    roles={[ROLE_NAME.DepartmentAdmin, ROLE_NAME.DepartmentHRAdvisor]}
  >
    <DepartmentDashboardPageApi />
  </RequireAuth>
);
Component.displayName = "DepartmentDashboardPage";

export default Component;
