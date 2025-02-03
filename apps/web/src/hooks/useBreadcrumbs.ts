import { useIntl } from "react-intl";
import { useSearchParams } from "react-router";

import type { BreadcrumbsProps } from "@gc-digital-talent/ui";
import { navigationMessages } from "@gc-digital-talent/i18n";

import useNavContext from "~/components/NavContext/useNavContext";

import useRoutes from "./useRoutes";

type Crumbs = BreadcrumbsProps["crumbs"];

interface useBreadcrumbsProps {
  crumbs: Crumbs;
}

const useBreadcrumbs = ({ crumbs }: useBreadcrumbsProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const [searchParams] = useSearchParams();
  const { navRole } = useNavContext();

  const iapPersonality = searchParams.get("personality") === "iap";
  let homePath = paths.home();

  switch (navRole) {
    case "applicant":
      homePath = paths.home();
      break;
    case "community":
      homePath = paths.communityDashboard();
      break;
    case "admin":
      homePath = paths.adminDashboard();
      break;
  }

  return [
    {
      url: !iapPersonality ? homePath : paths.iap(),
      label: intl.formatMessage(navigationMessages.home),
    },
    ...crumbs,
  ];
};

export default useBreadcrumbs;
