import { DataStrategyResult, RouterContextProvider } from "react-router";

import { graphql } from "@gc-digital-talent/graphql";
import { NotFoundError } from "@gc-digital-talent/helpers";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import { requireUser } from "~/routing/auth";
import { graphqlClientContext, intlContext } from "~/routing/context";

import messages from "./messages";

export const DepartmentTeams_Query = graphql(/** GraphQL */ `
  query DepartmentTeams($id: UUID!) {
    department(id: $id) {
      teamIdForRoleAssignment
    }
  }
`);

export async function checkPlatformAdmin(
  args: {
    context: Readonly<RouterContextProvider>;
    request: Request;
  },
  next: () => Promise<Record<string, DataStrategyResult>>,
) {
  requireUser(args.context, args.request, [{ name: ROLE_NAME.PlatformAdmin }]);
  return await next();
}

export async function checkPlatformAdminOrDepartmentRoles(
  args: {
    context: Readonly<RouterContextProvider>;
    request: Request;
  },
  next: () => Promise<Record<string, DataStrategyResult>>,
) {
  requireUser(args.context, args.request, [
    { name: ROLE_NAME.PlatformAdmin },
    { name: ROLE_NAME.DepartmentAdmin },
    { name: ROLE_NAME.DepartmentHRAdvisor },
  ]);
  return await next();
}

export async function checkPlatformAdminOrDepartmentRolesWithTeams(
  args: {
    context: Readonly<RouterContextProvider>;
    request: Request;
    params: {
      locale: string;
      departmentId: string;
    };
  },
  next: () => Promise<Record<string, DataStrategyResult>>,
) {
  const intl = args.context.get(intlContext);
  const client = args.context.get(graphqlClientContext);

  const res = await client
    .query(DepartmentTeams_Query, { id: args.params.departmentId })
    .toPromise();

  if (!res.data?.department) {
    throw new NotFoundError(
      intl.formatMessage(messages.departmentNotFound, {
        departmentId: args.params.departmentId,
      }),
    );
  }

  requireUser(
    args.context,
    args.request,
    [
      { name: ROLE_NAME.PlatformAdmin },
      {
        name: ROLE_NAME.DepartmentAdmin,
        teamId: res.data.department.teamIdForRoleAssignment,
      },
      {
        name: ROLE_NAME.DepartmentHRAdvisor,
        teamId: res.data.department.teamIdForRoleAssignment,
      },
    ],
    true,
  );
  return await next();
}
