import { useIntl } from "react-intl";
import FlagIconOutline from "@heroicons/react/24/outline/FlagIcon";
import FlagIconSolid from "@heroicons/react/24/solid/FlagIcon";

import { IconButton } from "@gc-digital-talent/ui";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";

import { getFullNameLabel } from "~/utils/nameUtils";
import useCandidateFlagToggle from "~/hooks/useCandidateFlagToggle";

export const PoolCandidate_FlagFragment = graphql(/* GraphQL */ `
  fragment PoolCandidate_Flag on PoolCandidate {
    id
    isFlagged
    user {
      id
      firstName
      lastName
    }
  }
`);

export const PoolCandidateCandidateTable_FlagFragment = graphql(/* GraphQL */ `
  fragment PoolCandidateTable_Flag on PoolCandidateAdminView {
    id
    isFlagged
    user {
      id
      firstName
      lastName
    }
  }
`);

interface CandidateFlagProps {
  candidateQuery: FragmentType<typeof PoolCandidate_FlagFragment>;
  onFlagChange?: (newIsFlagged: boolean) => void;
  flagged?: boolean;
  size?: "sm" | "md" | "lg";
}

const CandidateFlag = ({
  candidateQuery,
  flagged,
  onFlagChange,
  size = "md",
}: CandidateFlagProps) => {
  const intl = useIntl();
  const candidate = getFragment(PoolCandidate_FlagFragment, candidateQuery);
  const [{ isFlagged, isUpdating: isUpdatingFlag }, toggleFlag] =
    useCandidateFlagToggle({
      id: candidate.id,
      onChange: onFlagChange,
      value: flagged,
      defaultValue: candidate?.isFlagged ?? false,
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
                  "Remove {candidateName} bookmark from top of column.",
                id: "ISSs88",
                description:
                  "Un-bookmark button label for applicant assessment tracking.",
              },
              {
                candidateName: getFullNameLabel(
                  candidate.user.firstName,
                  candidate.user.lastName,
                  intl,
                ),
              },
            )
          : intl.formatMessage(
              {
                defaultMessage: "Bookmark {candidateName} to top of column.",
                id: "Gc5hcz",
                description:
                  "Bookmark button label for applicant assessment tracking.",
              },
              {
                candidateName: getFullNameLabel(
                  candidate.user.firstName,
                  candidate.user.lastName,
                  intl,
                ),
              },
            )
      }
    />
  );
};

export default CandidateFlag;
