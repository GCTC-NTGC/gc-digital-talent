import { useEffect } from "react";
import {
  createSearchParams,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useQuery } from "urql";

import { useAuthentication } from "@gc-digital-talent/auth";
import { empty } from "@gc-digital-talent/helpers";
import { graphql } from "@gc-digital-talent/graphql";

import useRoutes from "~/hooks/useRoutes";

const CreateAccount_EmailQuery = graphql(/** GraphQL */ `
  query CreateAccount_EmailQuery {
    me {
      email
    }
  }
`);

/**
 * If user is logged in but has not
 * saved an email, redirect them to the
 * `/create-account` page
 */
// eslint-disable-next-line import/prefer-default-export
export const Component = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { loggedIn } = useAuthentication();
  const [{ data, fetching, stale }] = useQuery({
    query: CreateAccount_EmailQuery,
  });

  const email = data?.me?.email;
  const paths = useRoutes();
  const isToCreateAccount = [
    paths.gettingStarted(),
    paths.emailVerification(),
    paths.employeeRegistration(),
  ].includes(pathname);

  useEffect(() => {
    /**
     * Check the following then redirect to welcome page
     *  - User Logged in
     *  - Authorization query is not loading
     *  - User has no email associated with account
     *  - User is not trying to go to the welcome page directly already
     */
    if (loggedIn && !fetching && !stale && empty(email) && !isToCreateAccount) {
      navigate(
        {
          pathname: paths.gettingStarted(),
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

Component.displayName = "CreateAccountRedirect";
