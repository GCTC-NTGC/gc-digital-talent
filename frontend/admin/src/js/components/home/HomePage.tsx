import React from "react";
import { useIntl } from "react-intl";
import { HomeIcon, LoginIcon } from "@heroicons/react/outline";
import CardLink from "@common/components/CardLink";
import PageHeader from "@common/components/PageHeader";

const HomePage: React.FC = () => {
  const intl = useIntl();

  return (
    <div data-h2-padding="b(all, m)">
      <PageHeader icon={HomeIcon}>
        {intl.formatMessage({
          defaultMessage: "Home",
          description: "Title for homepage on the talent cloud admin portal.",
        })}
      </PageHeader>
      <p>
        {intl.formatMessage({
          defaultMessage: "Welcome to GC Talent, please log in to continue.",
          description:
            "Instructional text for the talent cloud pool manager portal home page.",
        })}
      </p>
      <div data-h2-width="b(100) m(50) l(25)" data-h2-margin="b(top, l)">
        <CardLink
          href="/auth/login"
          external
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
