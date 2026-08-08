import { useIntl } from "react-intl";

import type { FragmentType } from "@gc-digital-talent/graphql";
import { getFragment, graphql } from "@gc-digital-talent/graphql";
import type { HeadingLevel } from "@gc-digital-talent/ui";
import { PreviewList } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";
import { notEmpty } from "@gc-digital-talent/helpers";
import {
  DATE_FORMAT_LOCALIZED,
  formatDate,
  parseDateTimeUtc,
} from "@gc-digital-talent/date-helpers";

import talentNominationMessages from "~/messages/talentNominationMessages";
import { getFullNameLabel } from "~/utils/nameUtils";

export const NominationsReceivedListItem_Fragment = graphql(/* GraphQL */ `
  fragment NominationsReceivedListItem on TalentNominationGroup {
    id
    createdAt
    talentNominationEvent {
      id
      name {
        localized
      }
      community {
        name {
          localized
        }
      }
    }
    advancementNominationCount
    lateralMovementNominationCount
    developmentProgramsNominationCount
    nominations {
      id
      nominator {
        firstName
        lastName
      }
    }
  }
`);

interface NominationsReceivedListItemProps {
  headingAs?: HeadingLevel;
  nominationGroupQuery: FragmentType<
    typeof NominationsReceivedListItem_Fragment
  >;
}

const NominationsReceivedListItem = ({
  headingAs,
  nominationGroupQuery,
}: NominationsReceivedListItemProps) => {
  const intl = useIntl();
  const nominationGroup = getFragment(
    NominationsReceivedListItem_Fragment,
    nominationGroupQuery,
  );

  const nominatedBy = intl.formatList(
    (nominationGroup.nominations ?? [])
      .filter(notEmpty)
      .map((nomination) =>
        getFullNameLabel(
          nomination.nominator?.firstName,
          nomination.nominator?.lastName,
          intl,
        ),
      ),
  );

  const nominationOptions = [
    (nominationGroup.advancementNominationCount ?? 0) > 0
      ? talentNominationMessages.nominateForAdvancement
      : null,
    (nominationGroup.lateralMovementNominationCount ?? 0) > 0
      ? talentNominationMessages.nominateForLateralMovement
      : null,
    (nominationGroup.developmentProgramsNominationCount ?? 0) > 0
      ? talentNominationMessages.development
      : null,
  ]
    .filter(notEmpty)
    .map((message) => intl.formatMessage(message).toLocaleLowerCase())
    .join(", ");

  const title = (
    <span className="font-normal">
      {intl.formatMessage(
        {
          defaultMessage:
            "Nominated by {nominatorName} for {nominationOptions}",
          id: "nvpGHw",
          description: "Title showing who nominated and what for",
        },
        {
          nominatorName: <span className="font-bold">{nominatedBy}</span>,
          nominationOptions: (
            <span className="font-bold">
              {nominationOptions ||
                intl.formatMessage(commonMessages.notProvided)}
            </span>
          ),
        },
      )}
    </span>
  );

  const receivedDate = nominationGroup.createdAt
    ? formatDate({
        date: parseDateTimeUtc(nominationGroup.createdAt),
        formatString: DATE_FORMAT_LOCALIZED,
        intl,
      })
    : intl.formatMessage(commonMessages.notProvided);

  type MetaDataProps = React.ComponentProps<
    typeof PreviewList.Item
  >["metaData"];
  type MetaDataPropItem = MetaDataProps[number];

  const metaData: MetaDataPropItem[] = [
    {
      key: "community",
      type: "text",
      children:
        nominationGroup.talentNominationEvent?.community?.name?.localized ??
        intl.formatMessage(commonMessages.notProvided),
    },
    {
      key: "event",
      type: "text",
      children:
        nominationGroup.talentNominationEvent?.name?.localized ??
        intl.formatMessage(commonMessages.notProvided),
    },
    {
      key: "date",
      type: "text",
      children: (
        <span>
          {intl.formatMessage({
            defaultMessage: "Accepted:",
            id: "YfNupN",
            description: "Label for accepted date of a nomination received",
          })}
          <span className="ml-1">{receivedDate}</span>
        </span>
      ),
    },
  ];

  return (
    <PreviewList.Item title={title} metaData={metaData} headingAs={headingAs} />
  );
};

export default NominationsReceivedListItem;
