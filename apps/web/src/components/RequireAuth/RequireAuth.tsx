import { useLocation, useNavigate, useSearchParams } from "react-router";
import { ReactNode, useEffect } from "react";

import { useLogger } from "@gc-digital-talent/logger";
import { Loading } from "@gc-digital-talent/ui";
import { notEmpty, UnauthorizedError } from "@gc-digital-talent/helpers";
import {
  RoleName,
  useAuthentication,
  useAuthorization,
} from "@gc-digital-talent/auth";

import useRoutes from "~/hooks/useRoutes";

import useNavContext from "../NavContext/useNavContext";

interface RequireAuthProps {
  children: ReactNode;
  roles: RoleName[];
  loginPath?: string;
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
  const paths = useRoutes();
  const loginRedirectPath = loginPath ?? paths.login();
  const navContext = useNavContext();

  const userRoleNames = roleAssignments
    ?.map((a) => a.role?.name)
    .filter(notEmpty);

  const isAuthorized =
    isLoaded &&
    authorizedRoleNames.some((authorizedRoleName) =>
      userRoleNames?.includes(authorizedRoleName),
    );

  useEffect(() => {
    if (!loggedIn) {
      const loginSearchParams = new URLSearchParams();
      loginSearchParams.append("from", location.pathname);
      const personality = searchParams.get("personality");
      if (personality) loginSearchParams.append("personality", personality);
      void navigate(
        {
          pathname: loginRedirectPath,
          search: loginSearchParams.toString(),
        },
        {
          replace: true,
        },
      );
    }
  }, [location.pathname, loggedIn, loginRedirectPath, navigate, searchParams]);

  useEffect(() => {
    if (isAuthorized) {
      navContext.onAuthorizedRolesChanged(authorizedRoleNames);
    }
  }, [authorizedRoleNames, isAuthorized, navContext]);

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
    throw new UnauthorizedError();
  }

  // Note: Need to return a ReactElement
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
};

export default RequireAuth;
