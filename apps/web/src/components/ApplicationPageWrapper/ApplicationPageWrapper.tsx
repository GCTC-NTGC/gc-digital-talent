import React from "react";
import { useIntl } from "react-intl";
import { CalendarIcon } from "@heroicons/react/24/outline";

import Hero from "@common/components/Hero/Hero";
import { BreadcrumbsProps } from "@common/components/Breadcrumbs/v2/Breadcrumbs";
import {
  parseDateTimeUtc,
  relativeClosingDate,
} from "@common/helpers/dateUtils";

import { PoolAdvertisement } from "~/api/generated";

import ApplicationNavigation, {
  type ApplicationNavigationProps,
} from "./ApplicationNavigation";

export interface ApplicationPageWrapperProps {
  title: string;
  subtitle?: string | React.ReactNode;
  crumbs?: BreadcrumbsProps["crumbs"];
  navigation?: ApplicationNavigationProps;
  closingDate: PoolAdvertisement["closingDate"];
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
  const showNav = !!(navigation && navigation.steps.length > 0);

  return (
    <>
      <Hero title={title} subtitle={subtitle} crumbs={crumbs} />
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
              "data-h2-border-bottom": "base(1px solid dt-gray.dark)",
              "data-h2-padding": "base(0, 0, x.5, 0)",
            })}
          >
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
                <span data-h2-display="base(block)">
                  {intl.formatMessage({
                    defaultMessage: "Closing date:",
                    id: "GIN69n",
                    description:
                      "Label for a pool advertisements closing date on the application",
                  })}
                </span>
                <span data-h2-display="base(block)">
                  {closingDate
                    ? relativeClosingDate({
                        closingDate: parseDateTimeUtc(closingDate),
                        intl,
                      })
                    : ""}
                </span>
              </p>
            </div>
          </div>
          {showNav && <ApplicationNavigation {...navigation} />}
        </div>
      </div>
      {children}
    </>
  );
};

export default ApplicationPageWrapper;
