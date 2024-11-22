import { useLocation } from "react-router";

import { PageNavInfo, PageNavMap } from "../types/pages";

/**
 * Get the current page
 *
 * Uses a map or array of available pages to
 * get the current page.
 *
 * NOTE: If we move the `loader`'s this
 * should become obsolete
 *
 * @param pages PageNavMap<K> | Array<PageNavInfo> Available pages
 * @returns PageNavInfo | undefined
 */
const useCurrentPage = <K>(
  pages: PageNavMap<K> | PageNavInfo[],
): PageNavInfo | undefined => {
  const { pathname } = useLocation();

  const pageArray = Array.isArray(pages) ? pages : Array.from(pages.values());

  const currentPage = pageArray.find((page) => page.link.url === pathname);

  return currentPage;
};

export default useCurrentPage;
