import * as React from "react";

import { IconType } from "@gc-digital-talent/ui";

const TwoBarsIcon: IconType = React.forwardRef(() => (
  <svg
    width="33"
    height="32"
    viewBox="0 0 33 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="0.199951" y="20" width="8" height="10" rx="1" fill="#087835" />
    <rect x="12.2498" y="9" width="8" height="21" rx="1" fill="#087835" />
    <mask id="path-3-inside-1_6893_16417" fill="white">
      <rect x="24.3" y="2" width="8" height="28" rx="1" />
    </mask>
    <rect x="24.3" y="2" width="8" height="28" rx="1" fill="white" />
    <rect
      x="24.3"
      y="2"
      width="8"
      height="28"
      rx="1"
      stroke="#80C199"
      strokeWidth="4"
      mask="url(#path-3-inside-1_6893_16417)"
    />
  </svg>
));
export default TwoBarsIcon;
