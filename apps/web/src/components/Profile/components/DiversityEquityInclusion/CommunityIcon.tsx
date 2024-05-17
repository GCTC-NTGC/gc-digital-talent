import { IndigenousCommunity } from "@gc-digital-talent/graphql";

import firstNationsIcon from "~/assets/img/first-nations-true.webp";
import inuitIcon from "~/assets/img/inuit-true.webp";
import metisIcon from "~/assets/img/metis-true.webp";
import otherIcon from "~/assets/img/other-true.webp";

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

  return <img className="w-12" alt="" src={icon} />;
};

export default CommunityIcon;
