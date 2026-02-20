import { redirect } from "react-router";

import {
  hasRequiredRoles,
  type RoleRequirement,
} from "@gc-digital-talent/auth";
import { UnauthorizedError } from "@gc-digital-talent/helpers";

import { intlContext, userContext, type AppContext } from "./context";

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
