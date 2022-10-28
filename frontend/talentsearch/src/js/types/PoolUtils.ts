import { Classification, Maybe } from "@common/api/generated";
import { notEmpty } from "@common/helpers/util";

export type SimpleClassification = Pick<Classification, "group" | "level">;

export type SimplePool = {
  id: string;
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
