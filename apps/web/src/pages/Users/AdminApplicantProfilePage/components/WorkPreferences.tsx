import { useIntl } from "react-intl";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { TableOfContents } from "@gc-digital-talent/ui";

import Display from "~/components/Profile/components/WorkPreferences/Display";
import { getLabels } from "~/utils/workPreferenceUtils";
import { FlexibleWorkLocationOptions_Fragment } from "~/components/Profile/components/WorkPreferences/fragment";

const WorkPreferences_Fragment = graphql(/** GraphQL */ `
  fragment AdminWorkPreferences on User {
    ...WorkPreferencesDisplay
  }
`);

interface WorkPreferencesProps {
  query: FragmentType<typeof WorkPreferences_Fragment>;
  optionsQuery:
    | FragmentType<typeof FlexibleWorkLocationOptions_Fragment>
    | undefined;
}

export const WORK_PREFERENCES_ID = "work-preferences";

const WorkPreferences = ({ query, optionsQuery }: WorkPreferencesProps) => {
  const intl = useIntl();
  const user = getFragment(WorkPreferences_Fragment, query);
  const labels = getLabels(intl);

  return (
    <TableOfContents.Section id={WORK_PREFERENCES_ID}>
      <Display query={user} optionsQuery={optionsQuery} labels={labels} />
    </TableOfContents.Section>
  );
};

export default WorkPreferences;
