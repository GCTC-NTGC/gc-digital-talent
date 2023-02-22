import React from "react";
import { createSearchParams, useLocation, useNavigate } from "react-router-dom";

import { LegacyRole } from "@gc-digital-talent/graphql";
import { useLogger } from "@gc-digital-talent/logger";
import { Loading } from "@gc-digital-talent/ui";

import useAuthentication from "../hooks/useAuthentication";
import useAuthorization from "../hooks/useAuthorization";

interface RequireAuthProps {
  children: React.ReactNode;
  roles: Array<LegacyRole>;
  loginPath: string;
}

const RequireAuth = ({ children, roles, loginPath }: RequireAuthProps) => {
  const location = useLocation();
  const logger = useLogger();
  const { loggedIn } = useAuthentication();
  const { loggedInUserRoles, isLoaded } = useAuthorization();
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
          pathname: loginPath,
          search: createSearchParams({ from: location.pathname }).toString(),
        },
        {
          replace: true,
        },
      );
    }
  }, [location.pathname, loggedIn, loginPath, navigate]);

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
