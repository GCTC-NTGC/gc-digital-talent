import { redirect } from "react-router";

import {
  checkPermissions,
  hasRequiredRoles,
  type PermissionRequirement,
  type RoleRequirement,
} from "@gc-digital-talent/auth";
import { UnauthorizedError } from "@gc-digital-talent/helpers";

import {
  intlContext,
  rolePermissionMapContext,
  userContext,
  type AppContext,
} from "./context";

/**
 * Validates user session and redirects to login-info if missing.
 * @param context The middleware/loader context
 * @param request The incoming request object
 * @param requirements Optional role/team requirements to check
 * @param strict When true, team-based roles must have a teamId provided
 */
export function requireUser<T extends AppContext>(
  context: T,
  request: Request,
  requirements?: RoleRequirement | RoleRequirement[],
  strict = false,
) {
  const user = context.get(userContext);
  const intl = context.get(intlContext);

  if (!user) {
    const { pathname } = new URL(request.url);
    const searchParams = new URLSearchParams({ from: pathname });

    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw redirect(`/${intl.locale}/login-info?${searchParams.toString()}`);
  }

  if (requirements) {
    const isAuthorized = hasRequiredRoles({
      toCheck: requirements,
      userRoles: user.roleAssignments,
      strict,
    });

    if (!isAuthorized) {
      throw new UnauthorizedError();
    }
  }

  return user;
}

/**
 * Throws UnauthorizedError if the user's roles do not satisfy at least one
 * of the given permission requirements.
 *
 * Reads role assignments from userContext and the permission map from
 * rolePermissionMapContext — both populated by userMiddleware.
 */
export function requirePermissions<T extends AppContext>(
  context: T,
  requirements: PermissionRequirement | PermissionRequirement[],
): void {
  const user = context.get(userContext);
  const map = context.get(rolePermissionMapContext);

  if (!checkPermissions(requirements, user?.roleAssignments, map)) {
    throw new UnauthorizedError();
  }
}
