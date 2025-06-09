import { ReactElement, ReactNode, useId } from "react";
import { tv, VariantProps } from "tailwind-variants";

import Heading, { HeadingLevel } from "../Heading";
import { BaseItemProps } from "./BaseItem";

const heading = tv({
  base: "rounded-t-md border-b p-6 text-center sm:px-8",
  variants: {
    headingColor: {
      primary:
        "border-b-primary-700 bg-primary-100 text-primary-700 dark:border-b-primary-100 dark:bg-primary-700 dark:text-primary-100",
      secondary:
        "border-b-secondary-700 bg-secondary-100 text-secondary-700 dark:border-b-secondary-100 dark:bg-secondary-700 dark:text-secondary-100",
      success:
        "border-b-success-700 bg-success-100 text-success-700 dark:border-b-success-100 dark:bg-success-700 dark:text-success-100",
      warning:
        "border-b-warning-700 bg-warning-100 text-warning-700 dark:border-b-warning-100 dark:bg-warning-700 dark:text-warning-100",
      error:
        "border-b-error-700 bg-error-100 text-error-700 dark:border-b-error-100 dark:bg-error-700 dark:text-error-100",
    },
  },
});

type HeadingVariants = VariantProps<typeof heading>;

type MaybeElement = ReactElement<BaseItemProps> | null;

export interface RootProps extends HeadingVariants {
  title: ReactNode;
  headingAs?: HeadingLevel;
  children: MaybeElement | MaybeElement[]; // Restricts children to only expected items;
}

const Root = ({
  title,
  headingColor = "primary",
  headingAs = "h3",
  children,
}: RootProps) => {
  const headingId = useId();
  return (
    <nav
      className="rounded-md bg-white shadow-lg dark:bg-gray-600"
      aria-labelledby={headingId}
    >
      <div className={heading({ headingColor })}>
        <Heading
          level={headingAs}
          size="h4"
          className="my-0 text-center"
          id={headingId}
        >
          {title}
        </Heading>
      </div>
      <div className="flex flex-col" role="list">
        {children}
      </div>
    </nav>
  );
};

export default Root;
