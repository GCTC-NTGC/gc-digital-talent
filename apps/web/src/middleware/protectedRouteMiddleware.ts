import { MiddlewareFunction, redirect } from "react-router";

import { userContext } from "./authMiddleware";
import { intlContext } from "./intlMiddleware";

const protectedRouteMiddleware: MiddlewareFunction = ({ context }) => {
  const user = context.get(userContext);
  const intl = context.get(intlContext);

  if (!user) {
    const loginSearchParams = new URLSearchParams();
    loginSearchParams.append("from", location.pathname);

    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw redirect(`${intl.locale}/login-info?${loginSearchParams.toString()}`);
  }
};

export default protectedRouteMiddleware;
