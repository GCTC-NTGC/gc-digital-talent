import React from "react";
import { useIntl } from "react-intl";
import Breadcrumbs, { BreadcrumbsProps } from "@common/components/Breadcrumbs";
import { imageUrl } from "@common/helpers/router";
import { relativeExpiryDate } from "@common/helpers/dateUtils";

import { CalendarIcon } from "@heroicons/react/outline";
import ApplicationNavigation, {
  type ApplicationNavigationProps,
} from "./ApplicationNavigation";
import TALENTSEARCH_APP_DIR from "../../talentSearchConstants";

export interface ApplicationPageWrapperProps {
  title: string;
  subtitle?: string;
  crumbs?: BreadcrumbsProps["links"];
  navigation?: ApplicationNavigationProps;
  closingDate: Date;
  children: React.ReactNode;
}

const ApplicationPageWrapper = ({
  title,
  subtitle,
  crumbs,
  closingDate,
  navigation,
  children,
}: ApplicationPageWrapperProps) => {
  const intl = useIntl();

  const banner = imageUrl(TALENTSEARCH_APP_DIR, "applicant-profile-banner.png");

  const breadcrumbs = crumbs ? <Breadcrumbs links={crumbs} /> : null;

  const showNav = !!(navigation && navigation.steps.length > 0);

  return (
    <>
      <div
        data-h2-padding="base(x1, x.5)"
        data-h2-color="base(dt-white)"
        style={{
          background: `url(${banner})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div data-h2-container="base(center, medium, x1)">
          <h1 data-h2-margin="base(x2, 0)">{title}</h1>
          {breadcrumbs}
        </div>
      </div>
      <div
        data-h2-background-color="base(dt-white)"
        data-h2-padding="base(x.5, 0)"
        data-h2-shadow="base(m)"
      >
        <div data-h2-container="base(center, medium, x1)">
          <div
            data-h2-display="base(flex)"
            data-h2-flex-direction="base(column) p-tablet(row)"
            data-h2-align-items="base(center)"
            data-h2-justify-content="base(space-between)"
            data-h2-margin="base(0, 0, x.5, 0) p-tablet(x.5, 0)"
            {...(showNav && {
              "data-h2-border": "base(bottom, 1px, solid, dt-gray.dark)",
              "data-h2-padding": "base(0, 0, x.5, 0)",
            })}
          >
            <div>
              {subtitle && (
                <h2
                  data-h2-color="base(dt-gray.dark)"
                  data-h2-font-size="base(h5, 1)"
                >
                  {subtitle}
                </h2>
              )}
            </div>
            <div
              data-h2-font-size="base(h5, 1)"
              data-h2-display="base(flex)"
              data-h2-align-items="base(center)"
            >
              <CalendarIcon
                style={{
                  width: "1em",
                  height: "1em",
                  marginRight: "0.5rem",
                }}
              />
              <p data-h2-font-size="base(h6, 1)">
                {intl.formatMessage({
                  defaultMessage: "Closing date:",
                  id: "GIN69n",
                  description:
                    "Label for a pool advertisements closing date on the application",
                })}
                <br />
                {relativeExpiryDate(new Date(closingDate), intl)}
              </p>
            </div>
          </div>
          {showNav && <ApplicationNavigation {...navigation} />}
        </div>
      </div>
      {children}
      {crumbs ? (
        <div
          data-h2-padding="base(x1, x.5) p-tablet(x1, x3)"
          data-h2-color="base(dt-white)"
          style={{
            background: `url(${banner})`,
            backgroundSize: "100vw 5rem",
          }}
        >
          <div data-h2-container="base(center, large, x1) p-tablet(center, large, x2)">
            {breadcrumbs}
          </div>
        </div>
      ) : null}
    </>
  );
};

export default ApplicationPageWrapper;
