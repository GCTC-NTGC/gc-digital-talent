import { useIntl } from "react-intl";

import { ROLE_NAME } from "@gc-digital-talent/auth";
import { graphql } from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import pageTitles from "~/messages/pageTitles";
import Hero from "~/components/Hero";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import { requireUser } from "~/routing/auth";
import { graphqlClientContext } from "~/routing/context";

import DepartmentTable from "./components/DepartmentTable";
import type { Route } from "./+types/IndexDepartmentPage";
import { roleAssignmentsToRoleDepartmentArray } from "./utils";

const Departments_Query = graphql(/* GraphQL */ `
  query Departments($whereArchived: Boolean) {
    departments(whereArchived: $whereArchived) {
      ...DepartmentTableRow
    }
    me {
      authInfo {
        id
        roleAssignments {
          ...DepartmentRoleAssignment
        }
      }
    }
  }
`);

export const clientMiddleware: Route.ClientMiddlewareFunction[] = [
  async ({ context, request }, next) => {
    requireUser(context, request, [
      { name: ROLE_NAME.PlatformAdmin },
      { name: ROLE_NAME.DepartmentAdmin },
      { name: ROLE_NAME.DepartmentHRAdvisor },
    ]);
    return await next();
  },
];

export async function clientLoader({ context }: Route.ClientLoaderArgs) {
  const client = context.get(graphqlClientContext);

  const res = await client
    .query(Departments_Query, {
      whereArchived: null, // explicit null value results in the Lighthouse directive not doing a thing
    })
    .toPromise();

  const roleAssignments = unpackMaybes(res.data?.me?.authInfo?.roleAssignments);
  const myRolesAndTeams = roleAssignmentsToRoleDepartmentArray(roleAssignments);

  return {
    departments: unpackMaybes(res.data?.departments),
    myRolesAndTeams: myRolesAndTeams,
  };
}

export const Component = ({ loaderData }: Route.ComponentProps) => {
  const intl = useIntl();
  const routes = useRoutes();
  const formattedPageTitle = intl.formatMessage(pageTitles.departments);

  const navigationCrumbs = useBreadcrumbs({
    crumbs: [
      {
        label: formattedPageTitle,
        url: routes.departmentTable(),
      },
    ],
  });

  return (
    <>
      <SEO title={formattedPageTitle} />
      <Hero title={formattedPageTitle} crumbs={navigationCrumbs} />
      <AdminContentWrapper table>
        <DepartmentTable
          departmentsQuery={loaderData.departments}
          title={formattedPageTitle}
          myRolesAndTeams={loaderData.myRolesAndTeams}
        />
      </AdminContentWrapper>
    </>
  );
};

Component.displayName = "AdminIndexDepartmentPage";

export default Component;
