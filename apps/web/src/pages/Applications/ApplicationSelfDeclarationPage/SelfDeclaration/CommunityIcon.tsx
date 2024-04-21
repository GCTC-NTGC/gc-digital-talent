import React from "react";
import { AnimatePresence, m } from "framer-motion";
import { useFormContext } from "react-hook-form";

import firstNationsOn from "~/assets/img/first-nations-true.webp";
import firstNationsOff from "~/assets/img/first-nations-false.webp";
import firstNationsOffDark from "~/assets/img/first-nations-false-dark.webp";
import inuitOn from "~/assets/img/inuit-true.webp";
import inuitOff from "~/assets/img/inuit-false.webp";
import inuitOffDark from "~/assets/img/inuit-false-dark.webp";
import metisOn from "~/assets/img/metis-true.webp";
import metisOff from "~/assets/img/metis-false.webp";
import metisOffDark from "~/assets/img/metis-false-dark.webp";
import otherOn from "~/assets/img/other-true.webp";
import otherOff from "~/assets/img/other-false.webp";
import otherOffDark from "~/assets/img/other-false-dark.webp";

import { partOfCommunity } from "./utils";

const getCommunityIcon = (community: string): [string, string, string] => {
  if (community === "first-nations") {
    return [firstNationsOn, firstNationsOff, firstNationsOffDark];
  }
  if (community === "inuit") {
    return [inuitOn, inuitOff, inuitOffDark];
  }
  if (community === "metis") {
    return [metisOn, metisOff, metisOffDark];
  }
  if (community === "other") {
    return [otherOn, otherOff, otherOffDark];
  }

  return ["", "", ""];
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
  const [iconOn, iconOff, iconOffDark] = getCommunityIcon(community);

  const styles = {
    className: "inset-0 absolute w-full h-full",
    // Fade animation
    initial: { opacity: 0 },
    exit: { opacity: 0 },
    animate: { opacity: 1 },
  };

  return (
    <div className="w-full">
      <div className="relative h-0 w-full pb-[100%]">
        <AnimatePresence>
          {isOn ? (
            <m.img {...styles} alt="" key={`${community}-true`} src={iconOn} />
          ) : (
            <>
              <m.img
                {...styles}
                data-h2-display="base(block) base:dark(none)"
                alt=""
                key={`${community}-false`}
                src={iconOff}
              />
              <m.img
                {...styles}
                data-h2-display="base(none) base:dark(block)"
                alt=""
                key={`${community}-false-dark`}
                src={iconOffDark}
              />
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CommunityIcon;
