import { useIntl } from "react-intl";
import PencilSquareIcon from "@heroicons/react/24/outline/PencilSquareIcon";

import type { FragmentType } from "@gc-digital-talent/graphql";
import { getFragment, graphql } from "@gc-digital-talent/graphql";
import type { HeadingLevel } from "@gc-digital-talent/ui";
import { PreviewList } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";

import { getFullNameLabel } from "~/utils/nameUtils";
import useRoutes from "~/hooks/useRoutes";
import { useMetaDataTalentNominationChip } from "~/hooks/useMetaDataTalentNominationChip";
import { NominationMetaDataDate } from "~/components/NominationMetaDataDate/NominationMetaDataDate";
import ReviewTalentNominationDialog from "~/components/ReviewTalentNominationDialog/ReviewTalentNominationDialog";

const PreviewListItemTalentNomination_Fragment = graphql(/* GraphQL */ `
  fragment EmployeeProfilePreviewListItemTalentNomination on TalentNomination {
    id
    createdAt
    submittedAt
    talentNominationEvent {
      name {
        localized
      }
      community {
        name {
          localized
        }
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
  talentNominationListItemQuery: FragmentType<
    typeof PreviewListItemTalentNomination_Fragment
  >;
}

const EmployeesNominatedListItem = ({
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

  const title = (
    <span className="font-normal">
      {intl.formatMessage(
        {
          defaultMessage: "Nomination for {name}",
          id: "p9H+Nl",
          description:
            "Title for a talent nomination in a preview list, naming the nominee",
        },
        {
          name: <span className="font-bold">{fullName}</span>,
        },
      )}
    </span>
  );

  const statusChip = useMetaDataTalentNominationChip({
    submittedAt: talentNominationListItemFragment.submittedAt,
  });
  const nominationEventName =
    talentNominationListItemFragment.talentNominationEvent?.name?.localized ??
    intl.formatMessage(commonMessages.notFound);
  const communityName =
    talentNominationListItemFragment.talentNominationEvent?.community?.name
      ?.localized ?? intl.formatMessage(commonMessages.notFound);

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
      key: "community",
      type: "text",
      children: communityName,
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

export default EmployeesNominatedListItem;
