import { useIntl } from "react-intl";

import { Chips, Chip } from "@gc-digital-talent/ui";
import { notEmpty } from "@gc-digital-talent/helpers";

import { FirstNationsStatus } from "~/utils/indigenousDeclaration";

import { getCommunityLabel } from "./utils";

interface CommunityChipsProps {
  communities: string[];
  status?: FirstNationsStatus;
  otherAlert: boolean;
  onDismiss: (community: string) => void;
}

const CommunityChips = ({
  communities,
  status,
  otherAlert,
  onDismiss,
}: CommunityChipsProps) => {
  const intl = useIntl();
  const communitiesWithLabels = communities
    .map((community) => {
      const label = getCommunityLabel({ community, intl, status });

      return label
        ? {
            community,
            label,
          }
        : null;
    })
    .filter(notEmpty);

  return communitiesWithLabels.length > 0 ? (
    <Chips className="mb-6">
      {communitiesWithLabels.map(({ community, label }) => {
        return (
          <Chip
            key={community}
            color={otherAlert && community === "other" ? "warning" : "primary"}
            onDismiss={() => onDismiss(community)}
          >
            {label}
          </Chip>
        );
      })}
    </Chips>
  ) : null;
};

export default CommunityChips;
