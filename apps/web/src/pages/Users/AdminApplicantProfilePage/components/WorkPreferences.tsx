import BriefcaseIcon from "@heroicons/react/24/outline/BriefcaseIcon";
import { useIntl } from "react-intl";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { Card, TableOfContents } from "@gc-digital-talent/ui";
import { navigationMessages } from "@gc-digital-talent/i18n";

import Display from "~/components/Profile/components/WorkPreferences/Display";
import { getLabels } from "~/components/Profile/components/WorkPreferences/utils";

const WorkPreferences_Fragment = graphql(/** GraphQL */ `
  fragment AdminWorkPreferences on User {
    acceptedOperationalRequirements {
      value
      label {
        localized
      }
    }
    positionDuration
    locationPreferences {
      value
      label {
        localized
      }
    }
    locationExemptions
    currentCity
    currentProvince {
      value
      label {
        localized
      }
    }
  }
`);

interface WorkPreferencesProps {
  query: FragmentType<typeof WorkPreferences_Fragment>;
}

export const WORK_PREFERENCES_ID = "work-preferences";

const WorkPreferences = ({ query }: WorkPreferencesProps) => {
  const intl = useIntl();
  const user = getFragment(WorkPreferences_Fragment, query);
  const labels = getLabels(intl);

  return (
    <TableOfContents.Section id={WORK_PREFERENCES_ID}>
      <TableOfContents.Heading
        icon={BriefcaseIcon}
        color="secondary"
        className="mb-3"
      >
        {intl.formatMessage(navigationMessages.workPreferences)}
      </TableOfContents.Heading>
      <Card>
        <Display user={user} labels={labels} />
      </Card>
    </TableOfContents.Section>
  );
};

export default WorkPreferences;
