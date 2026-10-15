import { useIntl } from "react-intl";

import type { FragmentType } from "@gc-digital-talent/graphql";
import { getFragment, graphql } from "@gc-digital-talent/graphql";
import type { HeadingRank } from "@gc-digital-talent/ui";
import { PreviewList } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";
import { notEmpty } from "@gc-digital-talent/helpers";
import {
  DATE_FORMAT_LOCALIZED,
  formatDate,
  parseDateTimeUtc,
} from "@gc-digital-talent/date-helpers";

import talentNominationMessages from "~/messages/talentNominationMessages";
import adminMessages from "~/messages/adminMessages";

import NominationsReceivedDialog from "./NominationsReceivedDialog";

export const NominationsReceivedListItem_Fragment = graphql(/* GraphQL */ `
  fragment NominationsReceivedListItem on TalentNominationGroupAsNominee {
    id
    updatedAt
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
    approvedForAdvancement
    approvedForLateralMovement
    approvedForDevelopmentPrograms
    nominatorNames
    ...NominationsReceivedDialog
  }
`);

interface NominationsReceivedListItemProps {
  headingAs?: HeadingRank;
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

  const nominatedBy = intl.formatList(nominationGroup.nominatorNames);

  const nominationOptions = [
    nominationGroup.approvedForAdvancement
      ? talentNominationMessages.nominateForAdvancement
      : null,
    nominationGroup.approvedForLateralMovement
      ? talentNominationMessages.nominateForLateralMovement
      : null,
    nominationGroup.approvedForDevelopmentPrograms
      ? adminMessages.developmentOpportunities
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

  const receivedDate = nominationGroup.updatedAt
    ? formatDate({
        date: parseDateTimeUtc(nominationGroup.updatedAt),
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
            defaultMessage: "Accepted on",
            id: "BOPQKQ",
            description: "Label for accepted date of a nomination received",
          })}
          {intl.formatMessage(commonMessages.dividingColon)}
          <span className="ml-1">{receivedDate}</span>
        </span>
      ),
    },
  ];

  return (
    <PreviewList.Item
      title={title}
      metaData={metaData}
      headingAs={headingAs}
      action={
        <NominationsReceivedDialog nominationGroupQuery={nominationGroup} />
      }
    />
  );
};

export default NominationsReceivedListItem;
