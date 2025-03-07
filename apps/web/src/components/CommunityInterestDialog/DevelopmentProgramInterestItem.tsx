import { useIntl } from "react-intl";
import CheckCircleIcon from "@heroicons/react/20/solid/CheckCircleIcon";
import ExclamationCircleIcon from "@heroicons/react/20/solid/ExclamationCircleIcon";
import XCircleIcon from "@heroicons/react/20/solid/XCircleIcon";
import QuestionMarkCircleIcon from "@heroicons/react/20/solid/QuestionMarkCircleIcon";
import BuildingLibraryIcon from "@heroicons/react/20/solid/BuildingLibraryIcon";

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
      "data-h2-color": "base(error) base:dark(error.lighter)",
    },
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
    : intl.formatMessage(commonMessages.notAvailable);

  const infoMap = new Map<DevelopmentProgramParticipationStatus, StatusInfo>([
    [
      DevelopmentProgramParticipationStatus.Interested,
      {
        Icon: QuestionMarkCircleIcon,
        iconStyles: {
          "data-h2-color": "base(primary) base:dark(primary.light)",
        },
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
        iconStyles: {
          "data-h2-color": "base(black.lighter) base:dark(black.5)",
        },
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
        iconStyles: {
          "data-h2-color": "base(primary) base:dark(primary.light)",
        },
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
        iconStyles: {
          "data-h2-color": "base(success) base:dark(success.lighter)",
        },
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
        data-h2-margin-top="base(x.15)"
        {...iconStyles}
      />
      <span data-h2-display="base(flex)" data-h2-flex-direction="base(column)">
        <span>{label}</span>
        <span
          data-h2-font-size="base(caption)"
          {...(!developmentProgramInterest?.participationStatus ||
          !developmentProgramInterest?.completionDate
            ? {
                "data-h2-color": "base(error) base:dark(error.lightest)",
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
