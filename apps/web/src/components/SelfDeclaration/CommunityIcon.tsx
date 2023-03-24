import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useFormContext } from "react-hook-form";

import firstNationsOn from "~/assets/img/first-nations-true.png";
import firstNationsOff from "~/assets/img/first-nations-false.png";
import inuitOn from "~/assets/img/inuit-true.png";
import inuitOff from "~/assets/img/inuit-false.png";
import metisOn from "~/assets/img/metis-true.png";
import metisOff from "~/assets/img/metis-false.png";
import otherOn from "~/assets/img/other-true.png";
import otherOff from "~/assets/img/other-false.png";

import { partOfCommunity } from "./utils";

const getCommunityIcon = (community: string): [string, string] => {
  if (community === "first-nations") {
    return [firstNationsOn, firstNationsOff];
  }
  if (community === "inuit") {
    return [inuitOn, inuitOff];
  }
  if (community === "metis") {
    return [metisOn, metisOff];
  }
  if (community === "other") {
    return [otherOn, otherOff];
  }

  return ["", ""];
};

interface CommunityIconProps {
  community: string;
  value: string;
}

const CommunityIcon = ({ community, value }: CommunityIconProps) => {
  const { watch } = useFormContext();
  const communitiesValue = watch("communities");
  const isOn = partOfCommunity(value as string, communitiesValue);
  const [iconOn, iconOff] = getCommunityIcon(community);

  const styles = {
    "data-h2-location": "base(0)",
    "data-h2-position": "base(absolute)",
    "data-h2-width": "base(100%)",
    "data-h2-height": "base(100%)",
    // Fade animation
    initial: { opacity: 0 },
    exit: { opacity: 0 },
    animate: { opacity: 1 },
  };

  return (
    <div data-h2-width="base(100%)">
      <div
        data-h2-position="base(relative)"
        data-h2-width="base(100%)"
        data-h2-height="base(0)"
        data-h2-padding="base(0, 0, 100%, 0)"
      >
        <AnimatePresence>
          {isOn ? (
            <motion.img
              {...styles}
              alt=""
              key={`${community}-true`}
              src={iconOn}
            />
          ) : (
            <motion.img
              {...styles}
              alt=""
              key={`${community}-false`}
              src={iconOff}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CommunityIcon;
