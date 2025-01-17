import { useIntl } from "react-intl";
import CheckCircleIcon from "@heroicons/react/20/solid/CheckCircleIcon";
import ExclamationCircleIcon from "@heroicons/react/20/solid/ExclamationCircleIcon";
import PlayCircleIcon from "@heroicons/react/20/solid/PlayCircleIcon";
import PauseCircleIcon from "@heroicons/react/20/solid/PauseCircleIcon";
import XCircleIcon from "@heroicons/react/20/solid/XCircleIcon";

import {
  DevelopmentProgramParticipationStatus,
  FragmentType,
  getFragment,
  graphql,
  Maybe,
} from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";
import { IconType } from "@gc-digital-talent/ui";
import { formatDate, parseDateTimeUtc } from "@gc-digital-talent/date-helpers";

const hasEnrolled = (
  status?: Maybe<DevelopmentProgramParticipationStatus>,
): boolean => {
  return (
    !!status &&
    [
      DevelopmentProgramParticipationStatus.Enrolled,
      DevelopmentProgramParticipationStatus.Completed,
    ].includes(status)
  );
};

interface StatusInfo {
  Icon: IconType;
  iconStyles: Record<string, string>;
  message: string;
}

const useStatusInfo = (
  status?: Maybe<DevelopmentProgramParticipationStatus>,
  completionDate?: Maybe<string>,
): StatusInfo => {
  const intl = useIntl();

  const defaultStatusInfo = {
    Icon: ExclamationCircleIcon,
    iconStyles: {
      "data-h2-color": "base(error)",
    },
    message: intl.formatMessage(commonMessages.missingInformation),
  };
  if (!status || (!completionDate && hasEnrolled(status))) {
    return defaultStatusInfo;
  }

  const date = completionDate
    ? formatDate({
        date: parseDateTimeUtc(completionDate),
        formatString: "MMMM yyyy",
        intl,
      })
    : intl.formatMessage(commonMessages.notAvailable);

  const infoMap = new Map<DevelopmentProgramParticipationStatus, StatusInfo>([
    [
      DevelopmentProgramParticipationStatus.Interested,
      {
        Icon: PlayCircleIcon,
        iconStyles: { "data-h2-color": "base(primary)" },
        message: intl.formatMessage({
          defaultMessage: "Interested in this program",
          id: "ytcZ7A",
          description:
            "Message displayed when a user is interested in a development program",
        }),
      },
    ],
    [
      DevelopmentProgramParticipationStatus.NotInterested,
      {
        Icon: XCircleIcon,
        iconStyles: { "data-h2-color": "base(gray.lighter)" },
        message: intl.formatMessage({
          defaultMessage: "Not interested",
          id: "9TIkDp",
          description:
            "Message displayed when a user is not interested in a development program",
        }),
      },
    ],
    [
      DevelopmentProgramParticipationStatus.Enrolled,
      {
        Icon: PauseCircleIcon,
        iconStyles: { "data-h2-color": "base(primary)" },
        message: intl.formatMessage(
          {
            defaultMessage: "Currently enrolled, expected completion in {date}",
            id: "fFihbX",
            description:
              "Message displayed when a user is enrolled in a development program",
          },
          { date },
        ),
      },
    ],
    [
      DevelopmentProgramParticipationStatus.Completed,
      {
        Icon: CheckCircleIcon,
        iconStyles: { "data-h2-color": "base(success)" },
        message: intl.formatMessage(
          {
            defaultMessage: "Completed in {date}",
            id: "RXFGuE",
            description:
              "Message when a user has completed a development program",
          },
          {
            date,
          },
        ),
      },
    ],
  ]);

  return infoMap.get(status) ?? defaultStatusInfo;
};

const CommunityInterestDialogDevelopmentProgram_Fragment = graphql(
  /* GraphQL */ `
    fragment CommunityInterestDialogDevelopmentProgramInterest on DevelopmentProgramInterest {
      participationStatus
      completionDate
    }
  `,
);

interface DevelopmentProgramInterestItemProps {
  label: string;
  developmentProgramInterestQuery?: FragmentType<
    typeof CommunityInterestDialogDevelopmentProgram_Fragment
  >;
}

const DevelopmentProgramInterestItem = ({
  label,
  developmentProgramInterestQuery,
}: DevelopmentProgramInterestItemProps) => {
  const developmentProgramInterest = getFragment(
    CommunityInterestDialogDevelopmentProgram_Fragment,
    developmentProgramInterestQuery,
  );
  const { Icon, iconStyles, message } = useStatusInfo(
    developmentProgramInterest?.participationStatus,
    developmentProgramInterest?.completionDate,
  );

  return (
    <li
      data-h2-display="base(flex)"
      data-h2-gap="base(x.25)"
      data-h2-align-items="base(flex-start)"
      data-h2-margin-bottom="base(x.25)"
    >
      <Icon
        data-h2-width="base(x.75)"
        data-h2-height="base(x.75)"
        {...iconStyles}
      />
      <span data-h2-display="base(flex)" data-h2-flex-direction="base(column)">
        <span data-h2-line-height="base(1)">{label}</span>
        <span
          data-h2-font-size="base(caption)"
          {...(!developmentProgramInterest?.participationStatus ||
          !developmentProgramInterest?.completionDate
            ? {
                "data-h2-color": "base(error)",
              }
            : {
                "data-h2-color": "base(black.light)",
              })}
        >
          {message}
        </span>
      </span>
    </li>
  );
};

export default DevelopmentProgramInterestItem;
