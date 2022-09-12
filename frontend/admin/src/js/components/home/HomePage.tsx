import React from "react";
import { useIntl } from "react-intl";
import {
  HomeIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import CardLink from "@common/components/CardLink";
import PageHeader from "@common/components/PageHeader";
import { useLocation } from "@common/helpers/router";
import { getLocale } from "@common/helpers/localize";
import { useApiRoutes } from "@common/hooks/useApiRoutes";

const HomePage: React.FC = () => {
  const intl = useIntl();
  const apiRoutes = useApiRoutes();
  const location = useLocation();

  return (
    <div>
      <div data-h2-container="base(center, large, x2)">
        <div data-h2-padding="base(0, 0, x3, 0)">
          <PageHeader icon={HomeIcon}>
            {intl.formatMessage({
              defaultMessage: "Home",
              id: "6EOrWk",
              description:
                "Title for homepage on the talent cloud admin portal.",
            })}
          </PageHeader>
          <p>
            {intl.formatMessage({
              defaultMessage:
                "Welcome to GC Talent, please log in to continue.",
              id: "LGo8fw",
              description:
                "Instructional text for the talent cloud pool manager portal home page.",
            })}
          </p>
          <div data-h2-margin="base(x2, 0, 0, 0)">
            <div data-h2-flex-grid="base(top, x2)">
              <div data-h2-flex-item="base(1of3)">
                <CardLink
                  external
                  href={apiRoutes.login(location.pathname, getLocale(intl))}
                  label={intl.formatMessage({
                    defaultMessage: "Login",
                    id: "TxEV7S",
                    description:
                      "Text label for the login link to the talent cloud admin portal.",
                  })}
                  icon={ArrowRightOnRectangleIcon}
                >
                  {intl.formatMessage({
                    defaultMessage: "Portal manager portal",
                    id: "u6GmEz",
                    description: "Title for the pool manager login link.",
                  })}
                </CardLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
