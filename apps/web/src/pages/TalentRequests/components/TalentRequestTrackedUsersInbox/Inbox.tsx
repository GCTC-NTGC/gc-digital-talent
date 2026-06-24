import type { ComponentPropsWithRef, ReactNode } from "react";
import { tv } from "tailwind-variants";

import { CheckButton } from "@gc-digital-talent/forms";

const toolbar = tv({
  base: "grid grid-cols-1 gap-6 border-b border-gray-500 px-6 pb-3 sm:grid-cols-2 dark:border-gray-300",
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
  base: "relative isolate flex cursor-pointer items-start gap-x-3 border-b border-gray-500 p-6 odd:bg-gray-100/50 even:bg-white dark:border-gray-300 dark:odd:bg-gray-700/50 dark:even:bg-gray-600",
});
const rowControl = tv({ base: "relative z-10 shrink-0" });
const rowContent = tv({ base: "min-w-0 flex-1" });

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
  base: "flex flex-wrap items-center gap-x-3 gap-y-1 text-sm [&>*:not(:first-child)]:before:mr-3 [&>*:not(:first-child)]:before:text-gray-400 [&>*:not(:first-child)]:before:content-['·'] dark:[&>*:not(:first-child)]:before:text-gray-200",
});

const RowMeta = ({ className, ...rest }: ComponentPropsWithRef<"div">) => (
  <div className={rowMeta({ class: className })} {...rest} />
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
