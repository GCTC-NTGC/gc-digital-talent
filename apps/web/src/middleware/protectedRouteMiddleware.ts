import { MiddlewareFunction, redirect } from "react-router";

import { RoleName } from "@gc-digital-talent/auth";
import { UnauthorizedError, unpackMaybes } from "@gc-digital-talent/helpers";

import { userContext } from "./authMiddleware";
import { intlContext } from "./intlMiddleware";

const makeProtectedRouteMiddleware = (
  roles: RoleName[],
): MiddlewareFunction => {
  return function ({ context }) {
    const user = context.get(userContext);
    const intl = context.get(intlContext);

    if (!user) {
      const loginSearchParams = new URLSearchParams();
      loginSearchParams.append("from", location.pathname);

      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw redirect(
        `${intl.locale}/login-info?${loginSearchParams.toString()}`,
      );
    }

    const userRoles = unpackMaybes(
      user?.roleAssignments?.flatMap((r) => r?.role?.name),
    );

    const isAuthorized = roles.some((name) => userRoles.includes(name));

    if (!isAuthorized) {
      throw new UnauthorizedError();
    }
  };
};

export default makeProtectedRouteMiddleware;
