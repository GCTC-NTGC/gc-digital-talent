import { HTMLAttributes } from "react";

const TrendingUp = (props: HTMLAttributes<HTMLOrSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 128 128"
    {...props}
  >
    <path
      fill="#E9568A"
      fillRule="evenodd"
      d="M69.53 41.129c-3.996 0-7.236-3.163-7.236-7.064 0-3.902 3.24-7.065 7.235-7.065h48.236c3.996 0 7.235 3.163 7.235 7.065V81.16c0 3.902-3.239 7.065-7.235 7.065-3.996 0-7.236-3.163-7.236-7.065V51.12L74.646 86.157c-2.826 2.758-7.407 2.758-10.233 0L45.412 67.604 14.352 97.93c-2.826 2.759-7.407 2.759-10.233 0a6.947 6.947 0 010-9.99l36.177-35.324c2.825-2.758 7.406-2.758 10.232 0L69.529 71.17l30.768-30.042H69.529z"
      clipRule="evenodd"
    />
  </svg>
);

export default TrendingUp;
