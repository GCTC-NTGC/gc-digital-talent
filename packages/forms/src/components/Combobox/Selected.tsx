import XMarkIcon from "@heroicons/react/20/solid/XMarkIcon";
import { DetailedHTMLProps, HTMLAttributes, forwardRef } from "react";
import { tv } from "tailwind-variants";

import { inputStyles } from "../../styles";

const wrapper = tv({
  extend: inputStyles,
  base: "-mt-2.25 rounded-t-none border-t-transparent",
});

type HTMLDivProps = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

const Wrapper = (props: HTMLDivProps) => {
  return <div className={wrapper()} {...props} />;
};

const Items = (props: HTMLDivProps) => (
  <div className="mt-3 flex flex-wrap gap-0.5" {...props} />
);

type ItemProps = Omit<
  DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>,
  "ref"
>;

const Item = forwardRef<HTMLSpanElement, ItemProps>(
  ({ children, ...rest }, forwardedRef) => (
    <span
      ref={forwardedRef}
      className="flex max-w-full cursor-pointer items-center rounded-sm bg-secondary-100 px-1.5 py-0.5 text-sm text-secondary-700 underline outline-none hover:bg-secondary-200 hover:no-underline focus-visible:bg-focus focus-visible:text-black dark:bg-secondary-700 dark:text-secondary-100 dark:hover:bg-secondary-600"
      {...rest}
    >
      <span className="w-full grow">{children}</span>
      <XMarkIcon className="size-4 shrink-0 align-top" />
    </span>
  ),
);

export default {
  Wrapper,
  Items,
  Item,
};
