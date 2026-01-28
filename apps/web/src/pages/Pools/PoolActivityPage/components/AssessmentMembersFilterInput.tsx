import { useState } from "react";
import { useIntl } from "react-intl";
import debounce from "lodash/debounce";

import { Combobox } from "@gc-digital-talent/forms";

import { getFullNameAndEmailLabel } from "~/utils/nameUtils";

import useAvailableAssessmentMembers from "./useAvailableAssessmentMembers";

const AssessmentMembersFilterInput = () => {
  const intl = useIntl();
  const [query, setQuery] = useState<string>("");
  const { assessmentMembers, fetching, total } = useAvailableAssessmentMembers(
    query || undefined,
  );

  const handleDebouncedSearch = debounce((newQuery: string) => {
    setQuery(newQuery);
  }, 300);

  const membersOptions = assessmentMembers.map((member) => ({
    value: member.id,
    label: getFullNameAndEmailLabel(
      member.firstName,
      member.lastName,
      member.email,
      intl,
    ),
  }));

  return (
    <Combobox
      id="causers"
      name="causers"
      fetching={fetching}
      isExternalSearch
      isMulti
      onSearch={handleDebouncedSearch}
      total={total}
      label={intl.formatMessage({
        defaultMessage: "Assessment team member",
        id: "CG07OF",
        description: "Label for a process assessment team member input",
      })}
      options={membersOptions ?? []}
    />
  );
};

export default AssessmentMembersFilterInput;
