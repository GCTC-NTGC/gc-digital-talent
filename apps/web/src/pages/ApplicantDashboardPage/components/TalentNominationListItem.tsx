import { useIntl } from "react-intl";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { HeadingLevel, PreviewList } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";

import { getFullNameLabel } from "~/utils/nameUtils";

import { useMetaDataDate, useMetaDataTalentNominationChip } from "./hooks";

export const PreviewListItemTalentNomination_Fragment = graphql(/* GraphQL */ `
  fragment PreviewListItemTalentNomination on TalentNomination {
    id
    submittedAt
    talentNominationEvent {
      name {
        localized
      }
      closeDate
    }
    nominee {
      firstName
      lastName
    }
  }
`);

interface TalentNominationListItemProps {
  headingAs?: HeadingLevel;
  talentNominationListItemQuery: FragmentType<
    typeof PreviewListItemTalentNomination_Fragment
  >;
}

const TalentNominationListItem = ({
  headingAs,
  talentNominationListItemQuery,
}: TalentNominationListItemProps) => {
  const intl = useIntl();

  const talentNominationListItemFragment = getFragment(
    PreviewListItemTalentNomination_Fragment,
    talentNominationListItemQuery,
  );

  const fullName = getFullNameLabel(
    talentNominationListItemFragment.nominee?.firstName,
    talentNominationListItemFragment.nominee?.lastName,
    intl,
  );
  const statusChip = useMetaDataTalentNominationChip({
    submittedAt: talentNominationListItemFragment.submittedAt,
  });
  const dateElement = useMetaDataDate({
    closeDate: talentNominationListItemFragment.talentNominationEvent.closeDate,
    submittedAt: talentNominationListItemFragment.submittedAt,
  });

  type MetaDataProps = React.ComponentProps<
    typeof PreviewList.Item
  >["metaData"];
  type MetaDataPropItem = MetaDataProps[number];
  const metaDataProps: MetaDataPropItem[] = [
    {
      key: "status",
      type: "chip",
      color: statusChip.color,
      children: statusChip.label,
    },
    {
      key: "name",
      type: "text",
      children:
        talentNominationListItemFragment.talentNominationEvent?.name
          ?.localized ?? intl.formatMessage(commonMessages.notFound),
    },
    {
      key: "date",
      type: "text",
      children: dateElement,
    },
  ];

  return (
    <>
      <PreviewList.Item
        title={fullName}
        metaData={metaDataProps}
        // action={}
        headingAs={headingAs}
      ></PreviewList.Item>
    </>
  );
};

export default TalentNominationListItem;
