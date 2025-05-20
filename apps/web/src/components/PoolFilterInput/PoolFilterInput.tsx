import { useIntl } from "react-intl";
import debounce from "lodash/debounce";
import { useState } from "react";

import type {
  PoolFilterInput as TPoolFilterInput,
  Scalars,
} from "@gc-digital-talent/graphql";
import Combobox from "@gc-digital-talent/forms/Combobox";

import adminMessages from "~/messages/adminMessages";

import usePoolFilterOptions from "./usePoolFilterOptions";

interface PoolFilterInputProps {
  name?: string;
  id?: string;
  label?: React.ReactNode;
  filterInput?: TPoolFilterInput;
  includeIds?: Scalars["UUID"]["input"][];
  excludeIds?: Scalars["UUID"]["input"][];
}

const PoolFilterInput = ({
  includeIds,
  excludeIds,
  label,
  filterInput = {},
  name = "pools",
  id = "pools",
}: PoolFilterInputProps) => {
  const intl = useIntl();
  const [query, setQuery] = useState<string>("");
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
    excludeIds,
  );

  const handleDebouncedSearch = debounce((newQuery: string) => {
    setQuery(newQuery);
  }, 300);

  return (
    <Combobox
      {...{ name, id }}
      isMulti
      isExternalSearch
      label={label ?? intl.formatMessage(adminMessages.processes)}
      fetching={poolsFetching}
      total={total}
      onSearch={handleDebouncedSearch}
      options={poolOptions ?? []}
    />
  );
};

export default PoolFilterInput;
