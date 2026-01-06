import { PaginatorInfo } from "@gc-digital-talent/graphql";

export default function (
  total: number,
  currentPage = 1,
  perPage = 10,
): PaginatorInfo {
  const lastPage = Math.ceil(total / perPage);

  return {
    count: perPage,
    currentPage,
    perPage,
    hasMorePages: currentPage < lastPage,
    lastPage,
    total,
  };
}

export function fakePaginateData<T>(items: T[], info: PaginatorInfo): T[] {
  const startIndex = (info.currentPage - 1) * info.perPage;
  const endIndex = startIndex + info.perPage;
  return items.slice(startIndex, endIndex);
}
