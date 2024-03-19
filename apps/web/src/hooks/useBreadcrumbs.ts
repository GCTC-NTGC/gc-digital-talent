import { useIntl } from "react-intl";
import { useSearchParams } from "react-router-dom";

import type { BreadcrumbsProps } from "@gc-digital-talent/ui";

import useRoutes from "./useRoutes";

type Crumbs = BreadcrumbsProps["crumbs"];

const useBreadcrumbs = (crumbs: Crumbs, isAdmin?: boolean) => {
  const intl = useIntl();
  const paths = useRoutes();
  const [searchParams] = useSearchParams();

  const iapPersonality = searchParams.get("personality") === "iap";
  const homePath = isAdmin ? paths.adminDashboard : paths.home();

  return [
    {
      url: !iapPersonality ? homePath : paths.iap(),
      label: intl.formatMessage({
        defaultMessage: "Home",
        id: "EBmWyo",
        description: "Link text for the home link in breadcrumbs.",
      }),
    },
    ...crumbs,
  ];
};

export default useBreadcrumbs;
