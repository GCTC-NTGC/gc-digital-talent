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
        data-h2-padding="b(top-bottom, m) b(right-left, s)"
        data-h2-font-color="b(white)"
        style={{
          background: `url(${banner})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div data-h2-container="b(center, m)">
          <h1 data-h2-margin="b(top-bottom, l)">{title}</h1>
          {breadcrumbs}
        </div>
      </div>
      <div
        data-h2-bg-color="b(white)"
        data-h2-padding="b(top-bottom, s)"
        data-h2-shadow="b(m)"
      >
        <div data-h2-container="b(center, m)">
          <div
            data-h2-display="b(flex)"
            data-h2-flex-direction="b(column) s(row)"
            data-h2-align-items="b(center)"
            data-h2-justify-content="b(space-between)"
            data-h2-margin="b(bottom, s) s(top-bottom, s)"
            {...(showNav && {
              "data-h2-border": "b(darkgray, bottom, solid, s)",
              "data-h2-padding": "b(bottom, s)",
            })}
          >
            <div>
              {subtitle && (
                <h2
                  data-h2-font-color="b(darkgray)"
                  data-h2-font-size="b(h5)"
                  data-h2-margin="s(top-bottom, none)"
                >
                  {subtitle}
                </h2>
              )}
            </div>
            <div
              data-h2-font-size="b(h5)"
              data-h2-display="b(flex)"
              data-h2-align-items="b(center)"
            >
              <CalendarIcon
                style={{
                  width: "1em",
                  height: "1em",
                  marginRight: "0.5rem",
                }}
              />
              <p data-h2-font-size="b(h6)" data-h2-margin="b(top-bottom, none)">
                {intl.formatMessage({
                  defaultMessage: "Closing date:",
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
          data-h2-padding="b(top-bottom, m) b(right-left, s) s(right-left, xxl)"
          data-h2-font-color="b(white)"
          style={{
            background: `url(${banner})`,
            backgroundSize: "100vw 5rem",
          }}
        >
          {breadcrumbs}
        </div>
      ) : null}
    </>
  );
};

export default ApplicationPageWrapper;
