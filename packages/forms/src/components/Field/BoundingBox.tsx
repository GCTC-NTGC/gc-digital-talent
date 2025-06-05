import { DetailedHTMLProps, InputHTMLAttributes } from "react";
import { tv } from "tailwind-variants";

import { inputStyles } from "../../styles";

const boundingBox = tv({
  extend: inputStyles,
  base: "mt-1.5 flex flex-col gap-y-1.5",
  variants: {
    flat: {
      true: "border-0 border-transparent p-0",
      false: "bg-white dark:bg-gray-600",
    },
  },
});

interface BoundingBoxProps
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  flat?: boolean;
}

const BoundingBox = ({ flat, className, ...rest }: BoundingBoxProps) => {
  return <div className={boundingBox({ flat, class: className })} {...rest} />;
};

export default BoundingBox;
