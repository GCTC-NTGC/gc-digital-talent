import React from "react";
import { useIntl } from "react-intl";
import { HomeIcon, LoginIcon } from "@heroicons/react/solid";
import CardLink from "@common/components/CardLink";
import PageHeader from "@common/components/PageHeader";
import { navigate } from "@common/helpers/router";

import { AuthContext } from "../AuthContainer";
import { useAdminRoutes } from "../../adminRoutes";

const HomePage: React.FC = () => {
  const intl = useIntl();
  const { loggedIn } = React.useContext(AuthContext);
  const paths = useAdminRoutes();

  /**
   *   Note: I'm not sure if this is best practice
   *        Should we be redirecting users here or else where?
   */
  React.useEffect(() => {
    if (loggedIn) {
      // navigate(paths.poolTable());
    }
  }, [loggedIn, paths]);

  return (
    <div data-h2-padding="b(all, m)">
      <PageHeader icon={HomeIcon}>
        {intl.formatMessage({
          defaultMessage: "Home",
          description: "Title for homepage on the talent cloud admin portal.",
        })}
      </PageHeader>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean mollis
        elit vitae lacinia sodales.
      </p>
      <div data-h2-width="b(100) m(50) l(25)" data-h2-margin="b(top, l)">
        <CardLink
          href="#"
          label={intl.formatMessage({
            defaultMessage: "Login",
            description:
              "Text label for the login link to the talent cloud admin portal.",
          })}
          icon={LoginIcon}
        >
          {intl.formatMessage({
            defaultMessage: "Portal manager portal",
            description: "Title for the pool manager login link.",
          })}
        </CardLink>
      </div>
    </div>
  );
};

export default HomePage;
