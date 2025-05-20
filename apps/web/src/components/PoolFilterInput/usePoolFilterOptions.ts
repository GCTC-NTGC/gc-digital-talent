import { useQuery } from "urql";
import { useMemo } from "react";
import { useIntl } from "react-intl";

import { graphql, PoolFilterInput, Scalars } from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { ComboboxOption } from "@gc-digital-talent/forms/Combobox";

import { getShortPoolTitleLabel } from "~/utils/poolUtils";

const PoolFilter_Query = graphql(/* GraphQL */ `
  query PoolFilter(
    $where: PoolFilterInput
    $first: Int
    $includeIds: [UUID!]
    $excludeIds: [UUID!]
    $page: Int
  ) {
    poolsPaginated(
      where: $where
      includeIds: $includeIds
      excludeIds: $excludeIds
      first: $first
      page: $page
    ) {
      data {
        id
        publishingGroup {
          value
          label {
            en
            fr
          }
        }
        workStream {
          id
          name {
            en
            fr
          }
        }
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

interface UsePoolFilterOptionsReturn {
  poolOptions: ComboboxOption[];
  total: number;
  fetching: boolean;
}

const usePoolFilterOptions = (
  where?: PoolFilterInput,
  includeIds?: Scalars["UUID"]["input"][],
  excludeIds?: Scalars["UUID"]["input"][],
): UsePoolFilterOptionsReturn => {
  const intl = useIntl();
  const [{ data, fetching }] = useQuery({
    query: PoolFilter_Query,
    variables: {
      first: 100,
      where,
      includeIds,
      excludeIds,
    },
  });

  const pools = unpackMaybes(data?.poolsPaginated?.data);
  const total = data?.poolsPaginated.paginatorInfo?.total ?? 0;
  const poolOptions = useMemo(
    () =>
      pools.map((pool) => ({
        value: pool.id,
        label: getShortPoolTitleLabel(intl, {
          workStream: pool.workStream,
          name: pool.name,
          publishingGroup: pool.publishingGroup,
          classification: pool.classification,
        }),
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
