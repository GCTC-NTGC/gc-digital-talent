import React from "react";

import { useAuthentication, useAuthorization } from "@gc-digital-talent/auth";
import { Loading } from "@gc-digital-talent/ui";

import useRoutes from "~/hooks/useRoutes";

interface RequireUserNotDeletedProps {
  children: React.ReactNode;
}

/**
 * If user is logged in but account has
 * been deleted, logout and redirect them
 * to the `/user-deleted` page
 */
const RequireUserNotDeleted = ({ children }: RequireUserNotDeletedProps) => {
  const { loggedIn, logout } = useAuthentication();
  const { deletedDate, isLoaded: authorizationLoaded } = useAuthorization();
  const paths = useRoutes();
  const deletedPage = paths.userDeleted();

  React.useEffect(() => {
    /**
     * Check the following then redirect to deleted user page
     *  - User Logged in
     *  - Authorization query is not loading
     *  - User has been deleted
     */
    if (loggedIn && authorizationLoaded && !!deletedDate) {
      logout(deletedPage);
    }
  }, [loggedIn, authorizationLoaded, deletedDate, logout, deletedPage]);

  /**
   * Show the loading spinner
   * while we get the user deletedDate
   * to check
   */
  if (!authorizationLoaded) {
    return <Loading />;
  }

  // Note: Need to return a React.ReactElement
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
};

export default RequireUserNotDeleted;
