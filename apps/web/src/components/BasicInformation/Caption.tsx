import { ReactNode } from "react";

interface CaptionProps {
  children: ReactNode;
}
const Caption = (props: CaptionProps) => (
  <span
    className="text-sm font-normal text-gray-600 dark:text-gray-100"
    {...props}
  />
);

export default Caption;
