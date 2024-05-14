import { useQuery } from "urql";
import { useMemo } from "react";
import { useIntl } from "react-intl";

import { graphql, PoolFilterInput } from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { Option } from "@gc-digital-talent/forms";

import { getShortPoolTitleLabel } from "~/utils/poolUtils";

const PoolFilter_Query = graphql(/* GraphQL */ `
  query PoolFilter($where: PoolFilterInput, $first: Int, $page: Int) {
    poolsPaginated(where: $where, first: $first, page: $page) {
      data {
        id
        publishingGroup
        stream
        name {
          en
          fr
        }
        classification {
          id
          group
          level
        }
      }
      paginatorInfo {
        total
      }
    }
  }
`);

type UsePoolFilterOptionsReturn = {
  poolOptions: Option[];
  total: number;
  fetching: boolean;
};

const usePoolFilterOptions = (
  where?: PoolFilterInput,
): UsePoolFilterOptionsReturn => {
  const intl = useIntl();
  const [{ data, fetching }] = useQuery({
    query: PoolFilter_Query,
    variables: {
      first: 100,
      where,
    },
  });

  const pools = unpackMaybes(data?.poolsPaginated?.data);
  const total = data?.poolsPaginated.paginatorInfo?.total ?? 0;
  const poolOptions = useMemo(
    () =>
      pools.map((pool) => ({
        value: pool.id,
        label: getShortPoolTitleLabel(intl, pool),
      })),
    [pools, intl],
  );

  return {
    poolOptions,
    total,
    fetching,
  };
};

export default usePoolFilterOptions;
