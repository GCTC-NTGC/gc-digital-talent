import { useEffect } from "react";
import {
  createSearchParams,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router";
import { useQuery } from "urql";

import { useAuthentication } from "@gc-digital-talent/auth";
import { empty } from "@gc-digital-talent/helpers";
import { graphql } from "@gc-digital-talent/graphql";

import useRoutes from "~/hooks/useRoutes";

const Registration_Query = graphql(/** GraphQL */ `
  query Registration_Query {
    me {
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
export const Component = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { loggedIn } = useAuthentication();
  const [{ data, fetching, stale }] = useQuery({
    query: Registration_Query,
  });

  const email = data?.me?.email;
  const paths = useRoutes();
  const isToAccountPage = pathname === paths.registrationAccount();
  const isToExperiencePage = pathname === paths.registrationExperience();

  useEffect(() => {
    /**
     * Check the following then redirect to welcome page
     *  - User Logged in
     *  - Authorization query is not loading
     *  - User has no email associated with account
     *  - User is not trying to go to the welcome page directly already
     */
    if (loggedIn && !fetching && !stale) {
      if (empty(email) && !isToAccountPage) {
        void navigate(
          {
            pathname: paths.registrationAccount(),
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
    isToAccountPage,
    pathname,
    navigate,
    paths,
    isToExperiencePage,
  ]);

  return <Outlet />;
};

Component.displayName = "RegistrationRedirect";

export default Component;
