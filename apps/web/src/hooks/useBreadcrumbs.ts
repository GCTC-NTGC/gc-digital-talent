import { useIntl } from "react-intl";
import { useSearchParams } from "react-router-dom";

import type { BreadcrumbsProps } from "@gc-digital-talent/ui";
import { navigationMessages } from "@gc-digital-talent/i18n";

import useRoutes from "./useRoutes";

type Crumbs = BreadcrumbsProps["crumbs"];

interface useBreadcrumbsProps {
  crumbs: Crumbs;
  isAdmin?: boolean;
}

const useBreadcrumbs = ({ crumbs, isAdmin }: useBreadcrumbsProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const [searchParams] = useSearchParams();

  const iapPersonality = searchParams.get("personality") === "iap";
  const homePath = isAdmin ? paths.adminDashboard() : paths.home();

  return [
    {
      url: !iapPersonality ? homePath : paths.iap(),
      label: intl.formatMessage(navigationMessages.home),
    },
    ...crumbs,
  ];
};

export default useBreadcrumbs;
