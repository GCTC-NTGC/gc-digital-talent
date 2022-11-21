import {
  Pool,
  Classification,
  Maybe,
  UserPublicProfile,
  Skill,
  SkillFamily,
} from "../api/generated";

export type SimpleClassification = Pick<Classification, "group" | "level">;

export type SimplePool = Pick<Pool, "id" | "owner" | "description" | "name"> & {
  classifications?: SimpleClassification[];
};

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
