import { Classification, Maybe } from "@common/api/generated";
import { notEmpty } from "@common/helpers/util";
import { Pool } from "../api/generated";

export type SimpleClassification = Pick<Classification, "group" | "level">;

export type SimplePool = Pick<Pool, "id" | "owner" | "description" | "name"> & {
  classifications?: SimpleClassification[];
};

export const filterPoolsBySelectedClassification = (
  allPools: SimplePool[],
  classification: Maybe<SimpleClassification>,
) =>
  allPools
    ?.filter((pool) => {
      return pool?.classifications?.some(
        (x) =>
          x?.group === classification?.group &&
          x?.level === classification?.level,
      );
    })
    .filter(notEmpty);
