import React from "react";

import Breadcrumbs, { BreadcrumbsProps } from "@common/components/Breadcrumbs";
import { imageUrl } from "@common/helpers/router";

import ApplicationNavigation, {
  type ApplicationNavigationProps,
} from "./ApplicationNavigation";
import TALENTSEARCH_APP_DIR from "../../talentSearchConstants";

export interface ApplicationPageWrapperProps {
  title: string;
  subtitle?: string;
  crumbs?: BreadcrumbsProps["links"];
  navigation?: ApplicationNavigationProps;
}

const ApplicationPageWrapper = ({
  title,
  subtitle,
  crumbs,
  navigation,
}: ApplicationPageWrapperProps) => {
  return (
    <div
      data-h2-padding="b(top-bottom, m) b(right-left, s)"
      data-h2-font-color="b(white)"
      data-h2-text-align="b(center)"
      style={{
        background: `url(${imageUrl(
          TALENTSEARCH_APP_DIR,
          "applicant-profile-banner.png",
        )})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <h1 data-h2-margin="b(top-bottom, l)">{title}</h1>
    </div>
  );
};
