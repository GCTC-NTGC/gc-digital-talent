import React from "react";
import {
  createSearchParams,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  AuthenticationContext,
  AuthorizationContext,
} from "@common/components/Auth";
import { empty } from "@common/helpers/util";
import Loading from "@common/components/Pending/Loading";

import useRoutes from "~/hooks/useRoutes";

/**
 * If user is logged in but has not
 * saved an email, redirect them to the
 * `/create-account` page
 */
const CreateAccountRedirect = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { loggedIn } = React.useContext(AuthenticationContext);
  const { loggedInEmail, isLoaded: authorizationLoaded } =
    React.useContext(AuthorizationContext);
  const paths = useRoutes();
  const isToCreateAccount = pathname !== paths.createAccount();

  React.useEffect(() => {
    /**
     * Check the following then redirect to welcome page
     *  - User Logged in
     *  - Authorization query is not loading
     *  - User has no email associated with account
     *  - User is not trying to go to the welcome page directly already
     */
    if (
      loggedIn &&
      authorizationLoaded &&
      empty(loggedInEmail) &&
      isToCreateAccount
    ) {
      navigate(
        {
          pathname: paths.createAccount(),
          search: createSearchParams({ from: pathname }).toString(),
        },
        {
          replace: true,
        },
      );
    }
  }, [
    loggedIn,
    authorizationLoaded,
    loggedInEmail,
    isToCreateAccount,
    pathname,
    navigate,
    paths,
  ]);

  /**
   * Show the loading spinner
   * while we get the user roles/email
   * to check
   */
  if (!authorizationLoaded) {
    return <Loading />;
  }

  return <Outlet />;
};

export default CreateAccountRedirect;
