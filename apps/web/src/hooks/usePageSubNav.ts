import { NavigationProps } from "@common/components/PageHeader/Navigation";
import { PageNavMap } from "../types/pages";

/**
 * Page Nav
 *
 * Transforms a map of available pages
 * to the shape needed for the subnav
 *
 * @param pages PageNavMap<K> Available pages
 * @returns NavigationProps["items"]
 */
const usePageSubNav = <K>(pages: PageNavMap<K>): NavigationProps["items"] => {
  return Array.from(pages.values()).map((page) => ({
    url: page.link.url,
    label: page.link.label || page.title,
    icon: page.icon,
  }));
};

export default usePageSubNav;
