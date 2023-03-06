import { useLocation } from "react-router-dom";

import { PageNavInfo, PageNavMap } from "../types/pages";

/**
 * Get the current page
 *
 * Uses a map of available pages to
 * get the current page.
 *
 * NOTE: If we move the `loader`'s this
 * should become obsolete
 *
 * @param pages PageNavMap<K> Available pages
 * @returns PageNavInfo | undefined
 */
const useCurrentPage = <K>(pages: PageNavMap<K>): PageNavInfo | undefined => {
  const { pathname } = useLocation();

  const currentPage = Array.from(pages.values()).find(
    (page) => page.link.url === pathname,
  );

  return currentPage;
};

export default useCurrentPage;
