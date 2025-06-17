import { IconProps } from "@gc-digital-talent/ui";

const UnreadBellAlertIcon = (props: IconProps) => (
  <svg
    className="[&_.dot]:text-error"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 20 20"
    {...props}
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M10.76 2.99a6 6 0 00-7.14 5.892c0 1.886-.454 3.664-1.258 5.234a.75.75 0 00.515 1.076 32.94 32.94 0 003.257.507 3.5 3.5 0 006.971 0 32.942 32.942 0 003.257-.507.75.75 0 00.515-1.076 11.425 11.425 0 01-1.223-4.34 5.27 5.27 0 01-4.895-6.787zM3.833 4.107a.75.75 0 10-1.156-.955A8.97 8.97 0 00.82 6.978a.75.75 0 001.466.316 7.47 7.47 0 011.547-3.186zm3.835 11.716a2 2 0 003.901 0 33.546 33.546 0 01-3.901 0z"
      clipRule="evenodd"
    />
    <circle className="dot" cx="15.807" cy="4.508" r="3.389" />
  </svg>
);

export default UnreadBellAlertIcon;
