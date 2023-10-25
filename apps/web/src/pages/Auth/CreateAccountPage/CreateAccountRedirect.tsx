import React from "react";
import {
  createSearchParams,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useAuthentication } from "@gc-digital-talent/auth";
import { empty } from "@gc-digital-talent/helpers";
import { useMyEmailQuery } from "@gc-digital-talent/graphql";

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
  const [lookUpResult] = useMyEmailQuery();
  const { data: lookupData, fetching, stale } = lookUpResult;
  const email = lookupData?.me?.email;
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
    if (loggedIn && !fetching && !stale && empty(email) && isToCreateAccount) {
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
    fetching,
    stale,
    email,
    isToCreateAccount,
    pathname,
    navigate,
    paths,
  ]);

  return <Outlet />;
};

export default CreateAccountRedirect;
