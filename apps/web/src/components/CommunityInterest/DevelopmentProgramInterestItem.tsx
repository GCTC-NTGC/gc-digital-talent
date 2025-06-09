import { useIntl } from "react-intl";
import CheckCircleIcon from "@heroicons/react/20/solid/CheckCircleIcon";
import ExclamationCircleIcon from "@heroicons/react/20/solid/ExclamationCircleIcon";
import XCircleIcon from "@heroicons/react/20/solid/XCircleIcon";
import QuestionMarkCircleIcon from "@heroicons/react/20/solid/QuestionMarkCircleIcon";
import BuildingLibraryIcon from "@heroicons/react/20/solid/BuildingLibraryIcon";
import { tv } from "tailwind-variants";

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

interface StatusInfo {
  Icon: IconType;
  message: string;
}

const useStatusInfo = (
  status?: Maybe<DevelopmentProgramParticipationStatus>,
  completionDate?: Maybe<string>,
): StatusInfo => {
  const intl = useIntl();

  const defaultStatusInfo = {
    Icon: ExclamationCircleIcon,
    message: intl.formatMessage(commonMessages.missingInformation),
  };

  if (
    !status ||
    (!completionDate &&
      status === DevelopmentProgramParticipationStatus.Completed)
  ) {
    return defaultStatusInfo;
  }

  const date = completionDate
    ? formatDate({
        date: parseDateTimeUtc(completionDate),
        formatString: "MMMM yyyy",
        intl,
      })
    : null;

  const infoMap = new Map<DevelopmentProgramParticipationStatus, StatusInfo>([
    [
      DevelopmentProgramParticipationStatus.Interested,
      {
        Icon: QuestionMarkCircleIcon,
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
        Icon: BuildingLibraryIcon,
        message: date
          ? intl.formatMessage(
              {
                defaultMessage:
                  "Currently enrolled, expected completion in {date}",
                id: "fFihbX",
                description:
                  "Message displayed when a user is enrolled in a development program",
              },
              { date },
            )
          : intl.formatMessage({
              defaultMessage: "Currently enrolled",
              id: "cHKJC8",
              description:
                "Message displayed when a user is enrolled in a development program with no expected end date",
            }),
      },
    ],
    [
      DevelopmentProgramParticipationStatus.Completed,
      {
        Icon: CheckCircleIcon,
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

const devProgram = tv({
  slots: {
    base: "mb-1.5 flex items-start gap-1.5",
    icon: "mt-1 size-4.5 text-error dark:text-error-200",
    caption: "text-sm",
  },
  variants: {
    status: {
      [DevelopmentProgramParticipationStatus.Interested]: {
        icon: "text-secondary dark:text-secondary-300",
      },
      [DevelopmentProgramParticipationStatus.NotInterested]: {
        icon: "text-gray-300 dark:text-gray",
      },
      [DevelopmentProgramParticipationStatus.Enrolled]: {
        icon: "text-secondary dark:text-secondary-300",
      },
      [DevelopmentProgramParticipationStatus.Completed]: {
        icon: "text-success dark:text-success-200",
      },
    },
    hasError: {
      true: {
        caption: "text-error dark:text-error-100",
      },
      false: {
        caption: "text-gray- dark:text-gray-100",
      },
    },
  },
});

const CommunityInterestDevelopmentProgram_Fragment = graphql(/* GraphQL */ `
  fragment CommunityInterestDevelopmentProgramInterest on DevelopmentProgramInterest {
    participationStatus
    completionDate
  }
`);

interface DevelopmentProgramInterestItemProps {
  label: string;
  developmentProgramInterestQuery?: FragmentType<
    typeof CommunityInterestDevelopmentProgram_Fragment
  >;
}

const DevelopmentProgramInterestItem = ({
  label,
  developmentProgramInterestQuery,
}: DevelopmentProgramInterestItemProps) => {
  const developmentProgramInterest = getFragment(
    CommunityInterestDevelopmentProgram_Fragment,
    developmentProgramInterestQuery,
  );
  const { Icon, message } = useStatusInfo(
    developmentProgramInterest?.participationStatus,
    developmentProgramInterest?.completionDate,
  );

  const {
    base,
    icon: iconStyles,
    caption,
  } = devProgram({
    status: developmentProgramInterest?.participationStatus ?? undefined,
    hasError:
      !developmentProgramInterest?.participationStatus ||
      (developmentProgramInterest?.participationStatus ===
        DevelopmentProgramParticipationStatus.Completed &&
        !developmentProgramInterest?.completionDate),
  });

  return (
    <li className={base()}>
      <Icon className={iconStyles()} />
      <span className="flex flex-col">
        <span>{label}</span>
        <span className={caption()}>{message}</span>
      </span>
    </li>
  );
};

export default DevelopmentProgramInterestItem;
