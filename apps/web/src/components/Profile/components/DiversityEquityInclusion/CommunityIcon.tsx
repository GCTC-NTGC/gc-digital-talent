import React from "react";

import { IndigenousCommunity } from "~/api/generated";
import firstNationsIcon from "~/assets/img/first-nations-true.png";
import inuitIcon from "~/assets/img/inuit-true.png";
import metisIcon from "~/assets/img/metis-true.png";
import otherIcon from "~/assets/img/other-true.png";

const communityIconMap = new Map<IndigenousCommunity, string>([
  [IndigenousCommunity.Inuit, inuitIcon],
  [IndigenousCommunity.Metis, metisIcon],
  [IndigenousCommunity.NonStatusFirstNations, firstNationsIcon],
  [IndigenousCommunity.StatusFirstNations, firstNationsIcon],
  [IndigenousCommunity.Other, otherIcon],
]);

interface CommunityIconProps {
  community: IndigenousCommunity;
}

const CommunityIcon = ({ community }: CommunityIconProps) => {
  const icon = communityIconMap.get(community);

  if (!icon) return null;

  return (
    <img
      className="indigenous-community-image"
      data-h2-height="base(3rem)"
      alt=""
      src={icon}
    />
  );
};

export default CommunityIcon;
