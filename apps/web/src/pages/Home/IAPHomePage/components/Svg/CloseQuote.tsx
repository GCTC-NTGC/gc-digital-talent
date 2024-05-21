import { HTMLAttributes } from "react";

const CloseQuote = (props: HTMLAttributes<HTMLOrSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 78 62"
    aria-hidden="true"
    {...props}
  >
    <path
      fill="#fff"
      fillOpacity="0.5"
      d="M62.608 61.6H46.192L56.56 30.784H46.48V.256h31.104v27.648L62.608 61.6zm-46.08 0H.112L10.48 30.784H.4V.256h31.104v27.648L16.528 61.6z"
    />
  </svg>
);

export default CloseQuote;
