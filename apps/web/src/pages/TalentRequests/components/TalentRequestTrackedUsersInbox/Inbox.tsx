import type { ComponentPropsWithRef, ReactNode } from "react";
import { tv } from "tailwind-variants";

import { CheckButton } from "@gc-digital-talent/forms";

const root = tv({
  base: "overflow-hidden rounded-md border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-600",
});

const Root = ({ className, ...rest }: ComponentPropsWithRef<"div">) => (
  <div className={root({ class: className })} {...rest} />
);

const titleBar = tv({
  base: "border-b border-gray-200 px-6 py-4 dark:border-gray-700",
});
const titleText = tv({ base: "text-lg font-bold" });
const subtitleText = tv({
  base: "mt-1 text-sm text-gray-600 dark:text-gray-200",
});

interface TitleBarProps {
  title: ReactNode;
  subtitle?: ReactNode;
  className?: string;
}

const TitleBar = ({ title, subtitle, className }: TitleBarProps) => (
  <div className={titleBar({ class: className })}>
    <p className={titleText()}>{title}</p>
    {subtitle ? <p className={subtitleText()}>{subtitle}</p> : null}
  </div>
);

const toolbar = tv({
  base: "flex flex-wrap items-center gap-3 border-b border-gray-200 px-6 py-3 dark:border-gray-700",
});

const Toolbar = ({ className, ...rest }: ComponentPropsWithRef<"div">) => (
  <div className={toolbar({ class: className })} {...rest} />
);

const actions = tv({
  base: "flex flex-wrap items-center gap-3 border-b border-gray-200 px-6 py-2 dark:border-gray-700",
});

const Actions = ({ className, ...rest }: ComponentPropsWithRef<"div">) => (
  <div className={actions({ class: className })} {...rest} />
);

const list = tv({ base: "flex flex-col" });

const List = ({ className, ...rest }: ComponentPropsWithRef<"ul">) => (
  <ul className={list({ class: className })} {...rest} />
);

const row = tv({
  base: "relative flex items-start gap-x-3 border-b border-gray-200 px-6 py-3 last:border-b-0 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-700",
});
// Interactive children sit above the stretched row-open overlay so they stay clickable.
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
  base: "mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm",
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
  Root,
  TitleBar,
  Toolbar,
  Actions,
  List,
  Row,
  Footer,
};

export default Inbox;
