import { faker } from "@faker-js/faker";

import { PaginatorInfo } from "@gc-digital-talent/graphql";

const generatePaginatorInfo = (
  totalPages: number,
  itemsPerPage?: number,
  page?: number,
): PaginatorInfo => {
  const perPage = itemsPerPage ?? faker.number.int();
  const count = faker.number.int({
    max: perPage,
    min: 1,
  });
  const total = faker.number.int({
    max: totalPages * perPage,
    min: totalPages * perPage - (perPage - count),
  });
  const currentPage =
    page ??
    faker.number.int({
      max: totalPages,
      min: 1,
    });
  const hasMorePages = currentPage < totalPages;

  return {
    count,
    currentPage,
    hasMorePages,
    lastPage: totalPages,
    perPage,
    total,
  };
};

export const emptyPaginator = {
  paginatorInfo: generatePaginatorInfo(1),
  data: [],
};

export default generatePaginatorInfo;
