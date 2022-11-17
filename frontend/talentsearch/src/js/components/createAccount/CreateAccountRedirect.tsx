import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import {
  AuthenticationContext,
  AuthorizationContext,
} from "@common/components/Auth";
import { empty } from "@common/helpers/util";
import useRoutes from "../../hooks/useRoutes";

/**
 * If user is logged in but has not
 * saved an email, redirect them to the
 * `/create-account` page
 */
const CreateAccountRedirect = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { loggedIn } = React.useContext(AuthenticationContext);
  const { loggedInEmail, isLoaded: authorizationLoaded } =
    React.useContext(AuthorizationContext);
  const paths = useRoutes();

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
    location.pathname !== paths.createAccount()
  ) {
    return navigate(paths.createAccount(), {
      replace: true,
      state: { from: location.pathname },
    });
  }

  return <Outlet />;
};

export default CreateAccountRedirect;
