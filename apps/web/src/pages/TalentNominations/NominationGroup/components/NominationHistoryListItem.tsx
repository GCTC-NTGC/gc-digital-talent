import { useIntl } from "react-intl";
import CheckIcon from "@heroicons/react/20/solid/CheckIcon";
import XMarkIcon from "@heroicons/react/20/solid/XMarkIcon";
import QuestionMarkCircleIcon from "@heroicons/react/24/outline/QuestionMarkCircleIcon";

import {
  getFragment,
  graphql,
  type FragmentType,
  TalentNominationGroupDecision,
  TalentNominationGroupStatus,
} from "@gc-digital-talent/graphql";
import { PreviewList } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";
import { notEmpty } from "@gc-digital-talent/helpers";
import {
  DATE_FORMAT_LOCALIZED,
  formatDate,
  parseDateTimeUtc,
} from "@gc-digital-talent/date-helpers";

import { getFullNameLabel } from "~/utils/nameUtils";
import talentNominationMessages from "~/messages/talentNominationMessages";

import NominationDetailsDialog from "./NominationDetailsDialog/NominationDetailsDialog";

interface NominationMetaDataDateProps {
  closeDate: string;
  submittedAt?: string | null;
}

const NominationMetaDataDate = ({
  submittedAt,
}: NominationMetaDataDateProps) => {
  const intl = useIntl();
  if (!submittedAt) {
    return <>{intl.formatMessage(commonMessages.notProvided)}</>;
  }
  return (
    <>
      {formatDate({
        date: parseDateTimeUtc(submittedAt),
        formatString: DATE_FORMAT_LOCALIZED,
        intl,
      })}
    </>
  );
};

const NominationHistoryListItemNomination_Fragment = graphql(/* GraphQL */ `
  fragment NominationHistoryListItemNomination on TalentNomination {
    id
    submittedAt
    nominateForAdvancement
    nominateForLateralMovement
    nominateForDevelopmentPrograms
    talentNominationEvent {
      closeDate
    }
    nominator {
      firstName
      lastName
    }
    nominatorFallbackName
    ...TalentNominationDetailsDialogNomination
  }
`);

const NominationHistoryListItemNominationGroup_Fragment = graphql(
  /* GraphQL */ `
    fragment NominationHistoryListItemNominationGroup on TalentNominationGroup {
      id

      ...TalentNominationDetailsDialogNominationGroup
    }
  `,
);

interface NominationHistoryListItemProps {
  nominationQuery: FragmentType<
    typeof NominationHistoryListItemNomination_Fragment
  >;
  nominationGroupQuery: FragmentType<
    typeof NominationHistoryListItemNominationGroup_Fragment
  >;
  optionsQuery: React.ComponentProps<
    typeof NominationDetailsDialog
  >["optionsQuery"];
  advancementDecision?: TalentNominationGroupDecision | null;
  lateralMovementDecision?: TalentNominationGroupDecision | null;
  developmentProgramsDecision?: TalentNominationGroupDecision | null;
}

const NominationHistoryListItem = ({
  nominationQuery,
  nominationGroupQuery,
  optionsQuery,
  advancementDecision,
  lateralMovementDecision,
  developmentProgramsDecision,
}: NominationHistoryListItemProps) => {
  const intl = useIntl();

  const nomination = getFragment(
    NominationHistoryListItemNomination_Fragment,
    nominationQuery,
  );
  const nominationGroup = getFragment(
    NominationHistoryListItemNominationGroup_Fragment,
    nominationGroupQuery,
  );

  const nominatorName = nomination.nominator
    ? getFullNameLabel(
        nomination.nominator.firstName,
        nomination.nominator.lastName,
        intl,
      )
    : (nomination.nominatorFallbackName ??
      intl.formatMessage(commonMessages.notProvided));

  const nominationOptions = [
    nomination.nominateForAdvancement
      ? talentNominationMessages.nominateForAdvancement
      : null,
    nomination.nominateForLateralMovement
      ? talentNominationMessages.nominateForLateralMovement
      : null,
    nomination.nominateForDevelopmentPrograms
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
            "Nominated for {nominationOptions} by {nominatorName}",
          id: "Vq0BPN",
          description: "Subtitle for the nomination details dialog",
        },
        {
          nominationOptions: (
            <span className="font-bold">
              {nominationOptions ||
                intl.formatMessage(commonMessages.notProvided)}
            </span>
          ),
          nominatorName: <span className="font-normal">{nominatorName}</span>,
        },
      )}
    </span>
  );

  const getDecision = (): TalentNominationGroupStatus => {
    const decisions = [
      nomination.nominateForAdvancement && advancementDecision,
      nomination.nominateForLateralMovement && lateralMovementDecision,
      nomination.nominateForDevelopmentPrograms && developmentProgramsDecision,
    ].filter(Boolean) as TalentNominationGroupDecision[];

    if (decisions.length === 0) return TalentNominationGroupStatus.InProgress;

    const hasApproved = decisions.some(
      (d) => d === TalentNominationGroupDecision.Approved,
    );
    const hasRejected = decisions.some(
      (d) => d === TalentNominationGroupDecision.Rejected,
    );

    if (hasApproved && hasRejected)
      return TalentNominationGroupStatus.PartiallyApproved;
    if (hasApproved) return TalentNominationGroupStatus.Approved;
    return TalentNominationGroupStatus.Rejected;
  };

  const computedStatus = getDecision();

  const getStatusInfo = () => {
    if (computedStatus === TalentNominationGroupStatus.Approved) {
      return {
        text: intl.formatMessage(commonMessages.approved),
        icon: <CheckIcon className="mr-1 h-5 w-5 font-normal text-success" />,
      };
    } else if (computedStatus === TalentNominationGroupStatus.Rejected) {
      return {
        text: intl.formatMessage(commonMessages.notSupported),
        icon: <XMarkIcon className="mr-1 h-5 w-5 font-normal text-error" />,
      };
    } else if (
      computedStatus === TalentNominationGroupStatus.PartiallyApproved
    ) {
      return {
        text: intl.formatMessage(commonMessages.partiallyApproved),
        icon: <CheckIcon className="mr-1 h-5 w-5 font-normal text-success" />,
      };
    } else {
      return {
        text: intl.formatMessage(commonMessages.inProgress),
        icon: (
          <QuestionMarkCircleIcon className="mr-1 h-5 w-5 font-normal text-primary" />
        ),
      };
    }
  };

  const statusInfo = getStatusInfo();

  type MetaDataProps = React.ComponentProps<
    typeof PreviewList.Item
  >["metaData"];
  type MetaDataPropItem = MetaDataProps[number];
  const metaDataProps: MetaDataPropItem[] = [
    {
      key: "status",
      type: "text",
      children: (
        <span className="flex items-center">
          {statusInfo.icon}
          {statusInfo.text}
        </span>
      ),
    },
    {
      key: "date",
      type: "text",
      children: (
        <span>
          {intl.formatMessage({
            defaultMessage: "Received:",
            id: "rNw6z5",
            description: "Label for received date",
          })}
          <span className="ml-1">
            <NominationMetaDataDate
              closeDate={nomination.talentNominationEvent.closeDate}
              submittedAt={nomination.submittedAt}
            />
          </span>
        </span>
      ),
    },
  ];

  return (
    <PreviewList.Item
      title={title}
      metaData={metaDataProps}
      action={
        <NominationDetailsDialog
          nominationQuery={nomination}
          nominationGroupQuery={nominationGroup}
          optionsQuery={optionsQuery}
        />
      }
    />
  );
};

export default NominationHistoryListItem;
