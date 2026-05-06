import { useIntl } from "react-intl";
import type { ReactNode } from "react";

import {
  getFragment,
  graphql,
  type FragmentType,
} from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";
import { Card, Heading, Link } from "@gc-digital-talent/ui";
import { parseDateTimeUtc, formatDate } from "@gc-digital-talent/date-helpers";

import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";
import talentRequestMessages from "~/messages/talentRequestMessages";

import TalentRequestNotes from "./TalentRequestNotes";

const TalentRequestSidebar_Fragment = graphql(/** GraphQL */ `
  fragment TalentRequestSidebar on PoolCandidateSearchRequest {
    jobTitle
    fullName
    department {
      name {
        localized
      }
    }
    requestedDate
    statusChangedAt
    hrAdvisorEmail

    ...TalentRequestNotes
  }
`);

interface TalentRequestSidebarProps {
  query: FragmentType<typeof TalentRequestSidebar_Fragment>;
}

const TalentRequestSidebar = ({ query }: TalentRequestSidebarProps) => {
  const intl = useIntl();
  const talentRequest = getFragment(TalentRequestSidebar_Fragment, query);
  const notProvided = intl.formatMessage(commonMessages.notProvided);

  return (
    <Card>
      <div className="flex flex-col gap-y-1">
        <Heading size="h6" className="order-2 my-0">
          {talentRequest.fullName}
        </Heading>
        <p className="order-1 text-sm text-gray-500 dark:text-gray-200">
          {talentRequest.jobTitle}
        </p>
        <p className="order-3 text-sm">
          {talentRequest.department?.name.localized ?? notProvided}
        </p>
      </div>
      <Card.Separator space="sm" />
      <FieldDisplay
        label={intl.formatMessage({
          defaultMessage: "Last modified",
          id: "TA5562",
          description: "Label for the date an item was changed on",
        })}
      >
        {talentRequest.statusChangedAt
          ? formatDate({
              date: parseDateTimeUtc(talentRequest.statusChangedAt),
              formatString: "PPP p",
              intl,
            })
          : intl.formatMessage(commonMessages.notAvailable)}
      </FieldDisplay>
      <Card.Separator space="sm" />
      <div className="flex flex-col gap-y-6">
        <FieldDisplay
          label={intl.formatMessage(talentRequestMessages.hrAdvisorEmail)}
        >
          {talentRequest.hrAdvisorEmail ? (
            <Link href={`mailto:${talentRequest.hrAdvisorEmail}`}>
              {talentRequest.hrAdvisorEmail}
            </Link>
          ) : (
            notProvided
          )}
        </FieldDisplay>
        <FieldDisplay label={intl.formatMessage(commonMessages.received)}>
          {talentRequest.requestedDate
            ? formatDate({
                date: parseDateTimeUtc(talentRequest.requestedDate),
                formatString: "PPP p",
                intl,
              })
            : intl.formatMessage(commonMessages.notAvailable)}
        </FieldDisplay>
      </div>
      <Card.Separator space="sm" />
      <TalentRequestNotes query={talentRequest} />
    </Card>
  );
};

export default TalentRequestSidebar;
