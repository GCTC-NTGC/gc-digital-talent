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

const Registration_Query = graphql(/** GraphQL */ `
  query Registration_Query {
    me {
      id
      email
      isGovEmployee
    }
  }
`);

/**
 * If user is logged in but has not saved an email,
 * redirect them to the `/getting-started` page.
 * If they have an email but not isGovEmployee instead
 * redirect to the `/employee-registration` page
 */
// eslint-disable-next-line import/prefer-default-export
export const Component = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { loggedIn } = useAuthentication();
  const [{ data, fetching, stale }] = useQuery({
    query: Registration_Query,
  });

  const email = data?.me?.email;
  const isGovEmployee = data?.me?.isGovEmployee;
  const paths = useRoutes();
  const isToGettingStarted = pathname === paths.gettingStarted();
  const isToEmployeeRegistration =
    pathname === paths.emailVerification() ||
    pathname === paths.employeeInformation();

  useEffect(() => {
    /**
     * Check the following then redirect to welcome page
     *  - User Logged in
     *  - Authorization query is not loading
     *  - User has no email associated with account
     *  - User is not trying to go to the welcome page directly already
     */
    if (loggedIn && !fetching && !stale) {
      if (empty(email) && !isToGettingStarted) {
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

      // If the user has an email but empty isGovEmployee
      // instead redirect to employee registration page
      if (!empty(email) && empty(isGovEmployee) && !isToEmployeeRegistration) {
        navigate(
          {
            pathname: paths.employeeInformation(),
            search: createSearchParams({ from: pathname }).toString(),
          },
          {
            replace: true,
          },
        );
      }
    }
  }, [
    loggedIn,
    fetching,
    stale,
    email,
    isToGettingStarted,
    pathname,
    navigate,
    paths,
    isToEmployeeRegistration,
    isGovEmployee,
  ]);

  return <Outlet />;
};

Component.displayName = "RegistrationRedirect";
