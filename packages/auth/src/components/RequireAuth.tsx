import React from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

import { useLogger } from "@gc-digital-talent/logger";
import { Loading } from "@gc-digital-talent/ui";

import useAuthentication from "../hooks/useAuthentication";
import useAuthorization from "../hooks/useAuthorization";
import { RoleName } from "../const";

interface RequireAuthProps {
  children: React.ReactNode;
  roles: Array<RoleName>;
  loginPath: string;
}

const RequireAuth = ({
  children,
  roles: authorizedRoleNames,
  loginPath,
}: RequireAuthProps) => {
  const location = useLocation();
  const logger = useLogger();
  const { loggedIn } = useAuthentication();
  const { roleAssignments, isLoaded } = useAuthorization();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const userRoleNames = roleAssignments?.map((a) => a.role?.name);

  const isAuthorized =
    isLoaded &&
    authorizedRoleNames.some((authorizedRoleName) =>
      userRoleNames?.includes(authorizedRoleName),
    );

  React.useEffect(() => {
    if (!loggedIn) {
      const loginSearchParams = new URLSearchParams();
      loginSearchParams.append("from", location.pathname);
      const personality = searchParams.get("personality");
      if (personality) loginSearchParams.append("personality", personality);
      navigate(
        {
          pathname: loginPath,
          search: loginSearchParams.toString(),
        },
        {
          replace: true,
        },
      );
    }
  }, [location.pathname, loggedIn, loginPath, navigate, searchParams]);

  // Prevent showing children while login redirect happens
  if (!loggedIn) {
    return <Loading />;
  }

  if (loggedIn && !isAuthorized) {
    logger.notice(
      JSON.stringify({
        message: "Signed in but not authorized",
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
