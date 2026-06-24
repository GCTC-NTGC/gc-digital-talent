import { Children, Fragment } from "react";
import type { ComponentPropsWithRef, ReactNode } from "react";
import { tv } from "tailwind-variants";

import { CheckButton } from "@gc-digital-talent/forms";
import { UNICODE_CHAR } from "@gc-digital-talent/ui";

const toolbar = tv({
  base: "grid grid-cols-1 gap-6 border-b border-gray-500 px-6 pb-6 sm:grid-cols-2 dark:border-gray-300",
});

const Toolbar = ({ className, ...rest }: ComponentPropsWithRef<"div">) => (
  <div className={toolbar({ class: className })} {...rest} />
);

const actions = tv({
  base: "flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-gray-500 px-6 py-3 dark:border-gray-300",
});

const Actions = ({ className, ...rest }: ComponentPropsWithRef<"div">) => (
  <div className={actions({ class: className })} {...rest} />
);

const list = tv({ base: "flex flex-col" });

const List = ({ className, ...rest }: ComponentPropsWithRef<"ul">) => (
  <ul className={list({ class: className })} {...rest} />
);

const row = tv({
  base: "relative isolate flex gap-x-3 border-b border-gray-500 odd:bg-gray-100/50 even:bg-white dark:border-gray-300 dark:odd:bg-gray-700/50 dark:even:bg-gray-600",
});
const rowControl = tv({
  base: "relative inset-y-0 z-10 grid shrink-0 place-items-center pr-1.5 pl-6",
});
const rowContent = tv({ base: "relative min-w-0 flex-1 p-6 pl-1.5" });

interface RowProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
  children: ReactNode;
  className?: string;
}

const RowRoot = ({
  checked,
  onCheckedChange,
  label,
  children,
  className,
}: RowProps) => (
  <li className={row({ class: className })}>
    <div className={rowControl()}>
      <CheckButton
        checked={checked}
        onToggle={() => onCheckedChange(!checked)}
        label={label}
        className="after:absolute after:inset-0"
      />
    </div>
    <div className={rowContent()}>{children}</div>
  </li>
);

const rowTitle = tv({ base: "font-bold" });

const RowTitle = ({ className, ...rest }: ComponentPropsWithRef<"div">) => (
  <div className={rowTitle({ class: className })} {...rest} />
);

const rowMeta = tv({
  base: "flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-600 dark:text-gray-200",
});

const RowMeta = ({
  className,
  children,
  ...rest
}: ComponentPropsWithRef<"div">) => (
  <div className={rowMeta({ class: className })} {...rest}>
    {Children.toArray(children).map((child, index) => (
      <Fragment key={index}>
        {index > 0 && (
          <span className="text-gray-300 dark:text-gray-200" aria-hidden>
            {UNICODE_CHAR.BULLET}
          </span>
        )}
        {child}
      </Fragment>
    ))}
  </div>
);

const Row = Object.assign(RowRoot, { Title: RowTitle, Meta: RowMeta });

const footer = tv({ base: "px-6 py-3" });

const Footer = ({ className, ...rest }: ComponentPropsWithRef<"div">) => (
  <div className={footer({ class: className })} {...rest} />
);

const Inbox = {
  Toolbar,
  Actions,
  List,
  Row,
  Footer,
};

export default Inbox;
