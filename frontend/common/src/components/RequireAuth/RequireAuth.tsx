import React from "react";
import { createSearchParams, useLocation, useNavigate } from "react-router-dom";

import useAuth from "../../hooks/useAuth";
import useAuthorizationContext from "../../hooks/useAuthorizationContext";
import { LegacyRole } from "../../api/generated";
import useRoutes from "../../hooks/useRoutes";
import Loading from "../Pending/Loading";
import { useLogger } from "../../hooks/useLogger";

interface RequireAuthProps {
  children: React.ReactNode;
  roles: Array<LegacyRole>;
}

const RequireAuth = ({ children, roles }: RequireAuthProps) => {
  const location = useLocation();
  const routes = useRoutes();
  const logger = useLogger();
  const { loggedIn } = useAuth();
  const { loggedInUserRoles, isLoaded } = useAuthorizationContext();
  const navigate = useNavigate();

  const isAuthorized =
    isLoaded &&
    roles.some((authorizedRole: LegacyRole) =>
      loggedInUserRoles?.includes(authorizedRole),
    );

  React.useEffect(() => {
    if (!loggedIn) {
      navigate(
        {
          pathname: routes.login(),
          search: createSearchParams({ from: location.pathname }).toString(),
        },
        {
          replace: true,
        },
      );
    }
  }, [location.pathname, loggedIn, navigate, routes]);

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
