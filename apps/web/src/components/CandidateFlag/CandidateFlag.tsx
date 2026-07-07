import { useIntl } from "react-intl";
import FlagIconOutline from "@heroicons/react/24/outline/FlagIcon";
import FlagIconSolid from "@heroicons/react/24/solid/FlagIcon";

import { IconButton } from "@gc-digital-talent/ui";
import type { FragmentType } from "@gc-digital-talent/graphql";
import { getFragment, graphql } from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";

import { getFullNameLabel } from "~/utils/nameUtils";
import useCandidateFlagToggle from "~/hooks/useCandidateFlagToggle";

export const PoolCandidate_FlagFragment = graphql(/* GraphQL */ `
  fragment PoolCandidate_Flag on PoolCandidate {
    id
    applicationAssessmentData {
      isFlagged
    }
    user {
      id
      firstName
      lastName
    }
    pool {
      displayName {
        display {
          localized
        }
      }
    }
  }
`);

interface CandidateFlagProps {
  candidateQuery: FragmentType<typeof PoolCandidate_FlagFragment>;
  processTitle?: string | null;
  onFlagChange?: (newIsFlagged: boolean) => void;
  flagged?: boolean;
  size?: "sm" | "md" | "lg";
}

const CandidateFlag = ({
  candidateQuery,
  processTitle = null,
  flagged,
  onFlagChange,
  size = "md",
}: CandidateFlagProps) => {
  const intl = useIntl();
  const candidate = getFragment(PoolCandidate_FlagFragment, candidateQuery);
  const candidateName = getFullNameLabel(
    candidate.user.firstName,
    candidate.user.lastName,
    intl,
  );

  const [{ isFlagged, isUpdating: isUpdatingFlag }, toggleFlag] =
    useCandidateFlagToggle({
      id: candidate.id,
      onChange: onFlagChange,
      value: flagged,
      defaultValue: candidate?.applicationAssessmentData?.isFlagged ?? false,
      name: candidateName,
      processTitle:
        processTitle ??
        candidate.pool.displayName?.display.localized ??
        intl.formatMessage(commonMessages.notAvailable),
    });

  return (
    <IconButton
      color={isFlagged ? "warning" : "black"}
      onClick={toggleFlag}
      disabled={isUpdatingFlag}
      icon={isFlagged ? FlagIconSolid : FlagIconOutline}
      size={size}
      label={
        isFlagged
          ? intl.formatMessage(
              {
                defaultMessage:
                  "Remove {candidateName}'s flag for authorized users.",
                id: "EhRf8u",
                description:
                  "Un-flag button label for applicant assessment tracking.",
              },
              {
                candidateName,
              },
            )
          : intl.formatMessage(
              {
                defaultMessage: "Flag {candidateName} to authorized users.",
                id: "zYSicn",
                description:
                  "Flag button label for applicant assessment tracking.",
              },
              {
                candidateName,
              },
            )
      }
    />
  );
};

export default CandidateFlag;
