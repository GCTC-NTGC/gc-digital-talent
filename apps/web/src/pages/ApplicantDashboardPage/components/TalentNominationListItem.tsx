import { useIntl } from "react-intl";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { HeadingLevel, PreviewList } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";

import { getFullNameLabel } from "~/utils/nameUtils";
import useRoutes from "~/hooks/useRoutes";

import { useMetaDataTalentNominationChip } from "./hooks";
import { NominationMetaDataDate } from "./NominationMetaDataDate";

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
  const paths = useRoutes();

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
  const nominationEventName =
    talentNominationListItemFragment.talentNominationEvent?.name?.localized ??
    intl.formatMessage(commonMessages.notFound);

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
      children: nominationEventName,
    },
    {
      key: "date",
      type: "text",
      children: (
        <NominationMetaDataDate
          closeDate={
            talentNominationListItemFragment.talentNominationEvent.closeDate
          }
          submittedAt={talentNominationListItemFragment.submittedAt}
        />
      ),
    },
  ];

  return (
    <>
      <PreviewList.Item
        title={fullName}
        metaData={metaDataProps}
        action={
          talentNominationListItemFragment.submittedAt ? null : (
            <PreviewList.Link
              label={intl.formatMessage(
                {
                  defaultMessage: "Go to draft nomination for {eventName}",
                  id: "wtjCOv",
                  description:
                    "Accessibility text for preview link, points to draft nomination workflow",
                },
                { eventName: nominationEventName },
              )}
              href={paths.talentNomination(talentNominationListItemFragment.id)}
            />
          )
        }
        headingAs={headingAs}
      ></PreviewList.Item>
    </>
  );
};

export default TalentNominationListItem;
