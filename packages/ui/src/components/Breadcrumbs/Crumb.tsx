import { Link } from "react-router";
import ChevronRightIcon from "@heroicons/react/24/solid/ChevronRightIcon";
import { ReactNode } from "react";
import { tv, VariantProps } from "tailwind-variants";

const crumb = tv({
  base: "text-sm text-white outline-none hover:text-primary-200 focus-visible:bg-focus focus-visible:text-black iap:hover:text-secondary-100",
  variants: {
    isCurrent: {
      true: "font-bold",
      false: "underline",
    },
  },
});

type CrumbVariants = VariantProps<typeof crumb>;

interface CrumbProps extends CrumbVariants {
  children: ReactNode;
  url: string;
}

const Crumb = ({ children, isCurrent, url }: CrumbProps) => (
  <li>
    <Link
      to={url}
      className={crumb({ isCurrent })}
      {...(isCurrent
        ? {
            "aria-current": "page",
            reloadDocument: true,
          }
        : {})}
    >
      {children}
    </Link>
    {!isCurrent && (
      <span
        aria-hidden="true"
        className="ml-3 inline-flex h-6 w-3 items-center align-middle"
      >
        <ChevronRightIcon className="iap:sroke-primary size-3 fill-error stroke-error text-error iap:fill-primary iap:text-primary" />
      </span>
    )}
  </li>
);

export default Crumb;
