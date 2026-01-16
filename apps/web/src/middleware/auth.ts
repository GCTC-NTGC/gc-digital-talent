import { redirect } from "react-router";

import { hasRole, RoleName } from "@gc-digital-talent/auth";
import { UnauthorizedError } from "@gc-digital-talent/helpers";

import { intlContext, userContext, type AppContext } from "./context";

/**
 * Validates user session and redirects to login-info if missing.
 * @param context The middleware/loader context
 * @param pathname Current path for the 'from' redirect param
 */
export function requireUser<T extends AppContext>(
  context: T,
  request: Request,
  roles?: RoleName[],
) {
  const user = context.get(userContext);
  const intl = context.get(intlContext);

  if (!user) {
    const { pathname } = new URL(request.url);
    const searchParams = new URLSearchParams({ from: pathname });

    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw redirect(`/${intl.locale}/login-info?${searchParams.toString()}`);
  }

  if (roles) {
    const isAuthorized = hasRole(roles, user?.roleAssignments);

    if (!isAuthorized) {
      throw new UnauthorizedError();
    }
  }

  return user;
}
