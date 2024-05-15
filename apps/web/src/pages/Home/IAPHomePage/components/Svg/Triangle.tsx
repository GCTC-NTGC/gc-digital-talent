import * as React from "react";

const Triangle = (props: React.HTMLProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 539 359"
    {...props}
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M0 358.964L539 0H0v358.964z"
      clipRule="evenodd"
      opacity="0.35"
    />
  </svg>
);

export default Triangle;
