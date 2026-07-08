import { useIntl } from "react-intl";

import {
  getFragment,
  graphql,
  type FragmentType,
  TalentNominationGroupDecision,
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
import ComputedIcon from "./ComputedIcon";

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

const NominationHistoryListItem_Fragment = graphql(/* GraphQL */ `
  fragment NominationHistoryListItem on TalentNomination {
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

interface NominationHistoryListItemProps {
  nominationQuery: FragmentType<typeof NominationHistoryListItem_Fragment>;
  optionsQuery: React.ComponentProps<
    typeof NominationDetailsDialog
  >["optionsQuery"];
}

const NominationHistoryListItem = ({
  nominationQuery,
  optionsQuery,
}: NominationHistoryListItemProps) => {
  const intl = useIntl();

  const nomination = getFragment(
    NominationHistoryListItem_Fragment,
    nominationQuery,
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

  // get the decision based on submittedAt
  const getDecision = (
    submittedAt?: string | null,
  ): TalentNominationGroupDecision | null => {
    if (submittedAt) {
      return TalentNominationGroupDecision.Approved;
    }
    return null;
  };

  const decision = getDecision(nomination.submittedAt);
  const statusText =
    decision === TalentNominationGroupDecision.Approved
      ? intl.formatMessage(commonMessages.approved)
      : decision === TalentNominationGroupDecision.Rejected
        ? intl.formatMessage(commonMessages.notSupported)
        : intl.formatMessage(commonMessages.inProgress);

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
          <ComputedIcon count={1} decision={decision} />
          {statusText}
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
          optionsQuery={optionsQuery}
        />
      }
    />
  );
};

export default NominationHistoryListItem;
