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
  if (!status || !completionDate) {
    return defaultStatusInfo;
  }

  const infoMap = new Map<DevelopmentProgramParticipationStatus, StatusInfo>([
    [
      DevelopmentProgramParticipationStatus.Interested,
      {
        Icon: PlayCircleIcon,
        iconStyles: { "data-h2-color": "base(primary)" },
        message: intl.formatMessage({
          defaultMessage: "Interested in this program",
          id: "djZmfA",
          description:
            "Message diaplayed when a user is interested in a development program",
        }),
      },
    ],
    [
      DevelopmentProgramParticipationStatus.NotInterested,
      {
        Icon: XCircleIcon,
        iconStyles: { "data-h2-color": "base(gray.lighter)" },
        message: intl.formatMessage({
          defaultMessage: "Interested in this program",
          id: "djZmfA",
          description:
            "Message diaplayed when a user is interested in a development program",
        }),
      },
    ],
    [
      DevelopmentProgramParticipationStatus.Enrolled,
      {
        Icon: PauseCircleIcon,
        iconStyles: { "data-h2-color": "base(primary)" },
        message: intl.formatMessage({
          defaultMessage: "Interested in this program",
          id: "djZmfA",
          description:
            "Message diaplayed when a user is interested in a development program",
        }),
      },
    ],
    [
      DevelopmentProgramParticipationStatus.Completed,
      {
        Icon: CheckCircleIcon,
        iconStyles: { "data-h2-color": "base(success)" },
        message: intl.formatMessage({
          defaultMessage: "Interested in this program",
          id: "djZmfA",
          description:
            "Message diaplayed when a user is interested in a development program",
        }),
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

interface DevelopopmentProgramInterestItemProps {
  label: string;
  developmentProgramInterestQuery?: FragmentType<
    typeof CommunityInterestDialogDevelopmentProgram_Fragment
  >;
}

const DevelopopmentProgramInterestItem = ({
  label,
  developmentProgramInterestQuery,
}: DevelopopmentProgramInterestItemProps) => {
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
                "data-h2-color": "base(black.light))",
              })}
        >
          {message}
        </span>
      </span>
    </li>
  );
};

export default DevelopopmentProgramInterestItem;
