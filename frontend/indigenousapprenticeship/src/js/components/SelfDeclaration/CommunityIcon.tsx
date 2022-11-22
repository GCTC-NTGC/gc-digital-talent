import React from "react";

import imageUrl from "@common/helpers/imageUrl";
import INDIGENOUSAPPRENTICESHIP_APP_DIR from "../../constants/indigenousApprenticeshipConstants";

interface CommunityIconProps {
  community: string;
  on?: boolean;
}

const CommunityIcon = ({ community, on }: CommunityIconProps) => {
  return (
    <img
      data-h2-padding="p-tablet(0, x1)"
      data-h2-width="base(100%)"
      data-h2-height="base(auto)"
      alt=""
      src={imageUrl(
        INDIGENOUSAPPRENTICESHIP_APP_DIR,
        `${community}-${!!on}.png`,
      )}
    />
  );
};

export default CommunityIcon;
