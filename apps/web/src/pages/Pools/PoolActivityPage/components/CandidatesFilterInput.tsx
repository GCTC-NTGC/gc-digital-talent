import { useState } from "react";
import { useIntl } from "react-intl";
import debounce from "lodash/debounce";

import { Combobox } from "@gc-digital-talent/forms";

import tableMessages from "~/components/PoolCandidatesTable/tableMessages";
import { getFullNameAndEmailLabel } from "~/utils/nameUtils";

import useAvailableCandidates from "./useAvailableCandidates";

const CandidatesFilterInput = () => {
  const intl = useIntl();
  const [query, setQuery] = useState<string>("");
  const { candidates, fetching, total } = useAvailableCandidates(
    query || undefined,
  );

  const handleDebouncedSearch = debounce((newQuery: string) => {
    setQuery(newQuery);
  }, 300);

  const candidateOptions = candidates.map((candidate) => ({
    value: candidate.id,
    label: getFullNameAndEmailLabel(
      candidate.user.firstName,
      candidate.user.lastName,
      candidate.user.email,
      intl,
    ),
  }));

  return (
    <Combobox
      id="candidates"
      name="candidates"
      fetching={fetching}
      isExternalSearch
      isMulti
      onSearch={handleDebouncedSearch}
      total={total}
      label={intl.formatMessage(tableMessages.candidateName)}
      options={candidateOptions ?? []}
    />
  );
};

export default CandidatesFilterInput;
