import React from "react";
import { AnimatePresence, motion } from "framer-motion";

import imageUrl from "@common/helpers/imageUrl";
import { useFormContext } from "react-hook-form";
import INDIGENOUSAPPRENTICESHIP_APP_DIR from "../../constants/indigenousApprenticeshipConstants";
import { partOfCommunity } from "./utils";

interface CommunityIconProps {
  community: string;
  value: string;
}

const CommunityIcon = ({ community, value }: CommunityIconProps) => {
  const { watch } = useFormContext();
  const communitiesValue = watch("communities");
  const isOn = partOfCommunity(value as string, communitiesValue);

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
              src={imageUrl(
                INDIGENOUSAPPRENTICESHIP_APP_DIR,
                `${community}-true.png`,
              )}
            />
          ) : (
            <motion.img
              {...styles}
              alt=""
              key={`${community}-false`}
              src={imageUrl(
                INDIGENOUSAPPRENTICESHIP_APP_DIR,
                `${community}-false.png`,
              )}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CommunityIcon;
