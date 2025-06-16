import { AnimatePresence, m } from "motion/react";
import { useFormContext } from "react-hook-form";
import { tv } from "tailwind-variants";

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

const icon = tv({
  base: "absolute inset-0 size-full",
});

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
  const { watch } = useFormContext<{ communities: string[] }>();
  const communitiesValue = watch("communities");
  const isOn = values.some((value) => partOfCommunity(value, communitiesValue));
  const [iconOn, iconOff, iconOffDark] = getCommunityIcon(community);

  const styles = {
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
                className={icon({ class: "block dark:hidden" })}
                alt=""
                key={`${community}-false`}
                src={iconOff}
              />
              <m.img
                {...styles}
                className={icon({ class: "hidden dark:block" })}
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
