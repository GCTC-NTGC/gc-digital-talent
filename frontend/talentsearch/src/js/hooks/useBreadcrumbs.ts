import { useIntl } from "react-intl";
import type { BreadcrumbsProps } from "@common/components/Breadcrumbs/v2";
import { useTalentSearchRoutes } from "../talentSearchRoutes";

type Crumbs = BreadcrumbsProps["crumbs"];

const useBreadcrumbs = (crumbs: Crumbs) => {
  const intl = useIntl();
  const paths = useTalentSearchRoutes();

  return [
    {
      url: paths.home(),
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
