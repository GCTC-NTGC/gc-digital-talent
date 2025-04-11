import { useIntl } from "react-intl";
import PencilSquareIcon from "@heroicons/react/24/outline/PencilSquareIcon";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { HeadingLevel, PreviewList } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";
import { formatDate, parseDateTimeUtc } from "@gc-digital-talent/date-helpers";

import { getFullNameLabel } from "~/utils/nameUtils";
import useRoutes from "~/hooks/useRoutes";

import { useMetaDataTalentNominationChip } from "./hooks";
import { NominationMetaDataDate } from "./NominationMetaDataDate";
import ReviewTalentNominationDialog from "./ReviewTalentNominationDialog";

export const PreviewListItemTalentNomination_Fragment = graphql(/* GraphQL */ `
  fragment PreviewListItemTalentNomination on TalentNomination {
    id
    createdAt
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
    ...ReviewTalentNominationDialog
  }
`);

interface TalentNominationListItemProps {
  headingAs?: HeadingLevel;
  displayCreatedDate: boolean;
  talentNominationListItemQuery: FragmentType<
    typeof PreviewListItemTalentNomination_Fragment
  >;
}

const TalentNominationListItem = ({
  headingAs,
  displayCreatedDate,
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
  const localizedDateString = talentNominationListItemFragment.createdAt
    ? formatDate({
        date: parseDateTimeUtc(talentNominationListItemFragment.createdAt),
        formatString: "p PPP",
        intl,
      })
    : intl.formatMessage(commonMessages.notProvided);
  const title = displayCreatedDate
    ? `${fullName} (${localizedDateString})`
    : `${fullName}`;
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
        title={title}
        metaData={metaDataProps}
        action={
          talentNominationListItemFragment.submittedAt ? (
            <ReviewTalentNominationDialog
              talentNominationQuery={talentNominationListItemFragment}
            />
          ) : (
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
              icon={PencilSquareIcon}
            />
          )
        }
        headingAs={headingAs}
      ></PreviewList.Item>
    </>
  );
};

export default TalentNominationListItem;
