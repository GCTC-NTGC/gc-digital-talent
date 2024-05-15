import * as React from "react";

const ThickCircle = (props: React.HTMLAttributes<HTMLOrSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 600 600"
    {...props}
  >
    <circle cx="300" cy="300" r="300" fill="#1E1E23" opacity="0.45" />
    <circle cx="279.5" cy="288.5" r="121.5" fill="#272F6B" opacity="0.45" />
  </svg>
);

export default ThickCircle;
