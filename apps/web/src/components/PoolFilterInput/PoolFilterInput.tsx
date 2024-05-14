import React from "react";
import { useIntl } from "react-intl";
import debounce from "lodash/debounce";

import { Combobox } from "@gc-digital-talent/forms";

import adminMessages from "~/messages/adminMessages";

import usePoolFilterOptions from "./usePoolFilterOptions";

interface PoolFilterInputProps {
  name?: string;
  id?: string;
}

const PoolFilterInput = ({
  name = "pools",
  id = "pools",
}: PoolFilterInputProps) => {
  const intl = useIntl();
  const [query, setQuery] = React.useState<string>("");
  const {
    poolOptions,
    total,
    fetching: poolsFetching,
  } = usePoolFilterOptions({
    generalSearch: query || undefined,
  });

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
