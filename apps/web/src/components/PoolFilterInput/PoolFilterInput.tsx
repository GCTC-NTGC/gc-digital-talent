import React from "react";
import { useIntl } from "react-intl";
import debounce from "lodash/debounce";

import { Combobox } from "@gc-digital-talent/forms";
import { PoolFilterInput, Scalars } from "@gc-digital-talent/graphql";

import adminMessages from "~/messages/adminMessages";

import usePoolFilterOptions from "./usePoolFilterOptions";

interface PoolFilterInputProps {
  name?: string;
  id?: string;
  filterInput?: PoolFilterInput;
  includeIds?: Scalars["UUID"]["input"][];
}

const PoolFilterInput = ({
  includeIds,
  filterInput = {},
  name = "pools",
  id = "pools",
}: PoolFilterInputProps) => {
  const intl = useIntl();
  const [query, setQuery] = React.useState<string>("");
  const {
    poolOptions,
    total,
    fetching: poolsFetching,
  } = usePoolFilterOptions(
    {
      ...filterInput,
      generalSearch: query || undefined,
    },
    includeIds,
  );

  const handleDebouncedSearch = debounce((newQuery: string) => {
    setQuery(newQuery);
  }, 300);

  return (
    <Combobox
      {...{ name, id }}
      isMulti
      isExternalSearch
      label={intl.formatMessage(adminMessages.pools)}
      fetching={poolsFetching}
      total={total}
      onSearch={handleDebouncedSearch}
      options={poolOptions ?? []}
    />
  );
};

export default PoolFilterInput;
