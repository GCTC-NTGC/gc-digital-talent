import React from "react";
import {
  createSearchParams,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useAuthentication, useAuthorization } from "@gc-digital-talent/auth";
import { empty } from "@gc-digital-talent/helpers";
import { Loading } from "@gc-digital-talent/ui";

import useRoutes from "~/hooks/useRoutes";

/**
 * If user is logged in but has not
 * saved an email, redirect them to the
 * `/create-account` page
 */
const CreateAccountRedirect = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { loggedIn } = useAuthentication();
  const { email, isLoaded: authorizationLoaded } = useAuthorization();
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
    if (loggedIn && authorizationLoaded && empty(email) && isToCreateAccount) {
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
    email,
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
