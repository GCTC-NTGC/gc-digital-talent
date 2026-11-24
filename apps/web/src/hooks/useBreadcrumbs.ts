import { useIntl } from "react-intl";
import { useSearchParams } from "react-router";

import { navigationMessages } from "@gc-digital-talent/i18n";
import type { BreadcrumbsProps } from "@gc-digital-talent/ui";

import useRoutes from "./useRoutes";

type Crumbs = BreadcrumbsProps["crumbs"];

interface useBreadcrumbsProps {
  crumbs: Crumbs;
}

const useBreadcrumbs = ({ crumbs }: useBreadcrumbsProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const [searchParams] = useSearchParams();

  const iapPersonality = searchParams.get("personality") === "iap";

  return [
    {
      url: !iapPersonality ? paths.home() : paths.iap(),
      label: intl.formatMessage(navigationMessages.home),
    },
    ...crumbs,
  ];
};

export default useBreadcrumbs;
