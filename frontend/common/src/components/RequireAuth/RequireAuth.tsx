import React from "react";
import { useLocation } from "react-router-dom";

import useAuth from "../../hooks/useAuth";
import useAuthorizationContext from "../../hooks/useAuthorizationContext";
import { Role } from "../../api/generated";
import { useApiRoutes } from "../../hooks/useApiRoutes";
import useLocale from "../../hooks/useLocale";
import Loading from "../Pending/Loading";
import { useLogger } from "../../hooks/useLogger";

interface RequireAuthProps {
  children: React.ReactNode;
  roles: Array<Role>;
}

const RequireAuth = ({ children, roles }: RequireAuthProps) => {
  const { locale } = useLocale();
  const location = useLocation();
  const apiRoutes = useApiRoutes();
  const logger = useLogger();
  const { loggedIn } = useAuth();
  const { loggedInUserRoles, isLoaded } = useAuthorizationContext();

  const isAuthorized =
    isLoaded &&
    roles.some((authorizedRole: Role) =>
      loggedInUserRoles?.includes(authorizedRole),
    );

  React.useEffect(() => {
    if (!loggedIn) {
      window.location.replace(apiRoutes.login(location.pathname, locale));
    }
  }, [apiRoutes, locale, location.pathname, loggedIn, isAuthorized]);

  // Prevent showing children while login redirect happens
  if (!loggedIn) {
    return <Loading />;
  }

  if (loggedIn && !isAuthorized) {
    logger.notice(
      JSON.stringify({
        message: "Logged in but not authorized",
        pathname: location.pathname,
      }),
    );
    throw new Response("", {
      status: 401,
      statusText: "Unauthorized",
    });
  }

  // Note: Need to return a React.ReactElement
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
};

export default RequireAuth;
