import { SimpleClassification, SimplePool } from "~/types/pool";

// NOTE: This file is expected to grow
// eslint-disable-next-line import/prefer-default-export
export const poolMatchesClassification = (
  pool: SimplePool,
  classification: SimpleClassification,
): boolean => {
  return (
    pool.classifications?.some(
      (poolClassification) =>
        poolClassification?.group === classification?.group &&
        poolClassification?.level === classification?.level,
    ) ?? false
  );
};
