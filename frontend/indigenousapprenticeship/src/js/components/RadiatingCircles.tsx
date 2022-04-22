import React from "react";

const RadiatingCircle: React.FC = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 500 500"
    {...props}
  >
    <g stroke="#211C53" strokeWidth="4" opacity="0.2">
      <circle cx="250" cy="250" r="226.814"></circle>
      <circle cx="250" cy="250" r="248"></circle>
      <circle cx="248.941" cy="248.941" r="202.449"></circle>
      <circle cx="248.941" cy="248.941" r="151.602"></circle>
      <circle cx="248.94" cy="248.941" r="177.025"></circle>
      <circle cx="248.941" cy="248.941" r="126.178"></circle>
      <circle cx="248.941" cy="248.941" r="104.992"></circle>
      <circle cx="250" cy="250" r="82.746"></circle>
      <circle cx="250" cy="250" r="61.559"></circle>
      <circle cx="248.941" cy="248.941" r="32.958"></circle>
    </g>
  </svg>
);

export default RadiatingCircle;
