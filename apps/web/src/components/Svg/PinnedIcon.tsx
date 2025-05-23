import { forwardRef } from "react";

import Svg, { SVGProps } from "./Svg";

const PinnedIcon = forwardRef<SVGSVGElement, SVGProps>(
  (props, forwardedRef) => (
    <Svg ref={forwardedRef} viewBox="0 0 21 21" {...props}>
      <path
        fill="currentColor"
        d="m7.69 6.674.743.106.122-.856H7.69zm-.548 3.85.425.618.271-.186.047-.326zM4.85 14.877H4.1v.75h.75zm10.552 0v.75h.75v-.75zm-2.293-4.353-.743.106.047.326.271.186zm-.548-3.85v-.75h-.865l.122.856zm-6.852-1.19a.44.44 0 0 1 .44-.44v-1.5a1.94 1.94 0 0 0-1.94 1.94zm.44.44a.44.44 0 0 1-.44-.44h-1.5a1.94 1.94 0 0 0 1.94 1.94zm1.543 0H6.147v1.5H7.69v-1.5Zm.194 4.706.548-3.85-1.485-.212-.548 3.85zM5.6 14.877a4.52 4.52 0 0 1 1.968-3.735l-.85-1.236a6.02 6.02 0 0 0-2.618 4.97zm9.802-.75H4.85v1.5H15.4v-1.5Zm-2.718-2.985a4.52 4.52 0 0 1 1.968 3.735h1.5a6.02 6.02 0 0 0-2.619-4.971zm-.866-4.362.548 3.85 1.485-.212-.548-3.85zm2.285-.856H12.56v1.5h1.542zm.44-.44a.44.44 0 0 1-.44.44v1.5a1.94 1.94 0 0 0 1.94-1.94zm-.44-.44a.44.44 0 0 1 .44.44h1.5a1.94 1.94 0 0 0-1.94-1.94zm-7.954 0h7.954v-1.5H6.148v1.5Z"
      ></path>
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
        d="M10.125 14.877v3.364"
      ></path>
    </Svg>
  ),
);

export default PinnedIcon;
