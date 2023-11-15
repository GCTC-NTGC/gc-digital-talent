import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useFormContext } from "react-hook-form";

import firstNationsOn from "~/assets/img/first-nations-true.webp";
import firstNationsOff from "~/assets/img/first-nations-false.webp";
import inuitOn from "~/assets/img/inuit-true.webp";
import inuitOff from "~/assets/img/inuit-false.webp";
import metisOn from "~/assets/img/metis-true.webp";
import metisOff from "~/assets/img/metis-false.webp";
import otherOn from "~/assets/img/other-true.webp";
import otherOff from "~/assets/img/other-false.webp";

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
  values: string[];
}

const CommunityIcon = ({ community, values }: CommunityIconProps) => {
  const { watch } = useFormContext();
  const communitiesValue = watch("communities");
  const isOn = values.some((value) =>
    partOfCommunity(value as string, communitiesValue),
  );
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
