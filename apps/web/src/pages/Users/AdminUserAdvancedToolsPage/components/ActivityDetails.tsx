import { defineMessage, useIntl } from "react-intl";
import CalendarDaysIcon from "@heroicons/react/24/outline/CalendarDaysIcon";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { Card, TableOfContents } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";
import { formatDate, parseDateTimeUtc } from "@gc-digital-talent/date-helpers";

import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";

export const ACTIVITY_DETAILS_ID = "activity-details";

export const activityDetailsTitle = defineMessage({
  defaultMessage: "Activity details",
  id: "QXIC/M",
  description: "Title of admin user activity details section",
});

const UserActivityDetails_Fragment = graphql(/** GraphQQL*/ `
  fragment UserActivityDetails on User {
    authInfo {
      createdDate
      updatedDate
      lastSignInDate
    }
  }
`);

interface ActivityDetailsProps {
  query: FragmentType<typeof UserActivityDetails_Fragment>;
}

const ActivityDetails = ({ query }: ActivityDetailsProps) => {
  const intl = useIntl();
  const user = getFragment(UserActivityDetails_Fragment, query);
  const notAvailable = intl.formatMessage(commonMessages.notAvailable);

  return (
    <TableOfContents.Section id={ACTIVITY_DETAILS_ID}>
      <TableOfContents.Heading
        icon={CalendarDaysIcon}
        color="secondary"
        className="mb-6"
      >
        {intl.formatMessage(activityDetailsTitle)}
      </TableOfContents.Heading>
      <Card className="grid gap-6 sm:grid-cols-3">
        <FieldDisplay label={intl.formatMessage(commonMessages.created)}>
          {user.authInfo?.createdDate
            ? formatDate({
                date: parseDateTimeUtc(user.authInfo.createdDate),
                formatString: "PPP p",
                intl,
              })
            : notAvailable}
        </FieldDisplay>
        <FieldDisplay
          label={intl.formatMessage({
            defaultMessage: "Last sign-in",
            id: "6lfcJc",
            description: "Label for last time user signed in",
          })}
        >
          {user.authInfo?.lastSignInDate
            ? formatDate({
                date: parseDateTimeUtc(user.authInfo.lastSignInDate),
                formatString: "PPP p",
                intl,
              })
            : notAvailable}
        </FieldDisplay>
        <FieldDisplay label={intl.formatMessage(commonMessages.updated)}>
          {user.authInfo?.updatedDate
            ? formatDate({
                date: parseDateTimeUtc(user.authInfo.updatedDate),
                formatString: "PPP p",
                intl,
              })
            : notAvailable}
        </FieldDisplay>
      </Card>
    </TableOfContents.Section>
  );
};

export default ActivityDetails;
