import { redirect } from "react-router";

import {
  checkPermissions,
  hasRequiredRoles,
  type PermissionRequirement,
  type RoleRequirement,
} from "@gc-digital-talent/auth";
import { UnauthorizedError } from "@gc-digital-talent/helpers";

import { intlContext, userContext, type AppContext } from "./context";

interface RequireUserOptions {
  roles?: RoleRequirement | RoleRequirement[];
  permissions?: PermissionRequirement | PermissionRequirement[];
  strict?: boolean;
}

/**
 * Validates the user session, redirecting to login if missing.
 * Optionally asserts role and/or permission requirements, throwing
 * UnauthorizedError if neither set is satisfied.
 */
export function requireUser<T extends AppContext>(
  context: T,
  request: Request,
  options?: RequireUserOptions,
) {
  const user = context.get(userContext);
  const intl = context.get(intlContext);

  if (!user) {
    const { pathname } = new URL(request.url);
    const searchParams = new URLSearchParams({ from: pathname });

    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw redirect(`/${intl.locale}/login-info?${searchParams.toString()}`);
  }

  const { roles, permissions, strict = false } = options ?? {};

  if (roles) {
    const isAuthorized = hasRequiredRoles({
      toCheck: roles,
      userRoles: user.roleAssignments,
      strict,
    });

    if (!isAuthorized) {
      throw new UnauthorizedError();
    }
  }

  if (permissions) {
    if (!checkPermissions(permissions, user.roleAssignments)) {
      throw new UnauthorizedError();
    }
  }

  return user;
}
