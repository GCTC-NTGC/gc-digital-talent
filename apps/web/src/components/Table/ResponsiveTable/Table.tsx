import { useIntl } from "react-intl";
import { flexRender } from "@tanstack/react-table";
import type { Header, Cell } from "@tanstack/react-table";
import PlusCircleIcon from "@heroicons/react/20/solid/PlusCircleIcon";
import {
  DetailedHTMLProps,
  HTMLAttributes,
  TableHTMLAttributes,
  ReactNode,
} from "react";
import { tv } from "tailwind-variants";

import { Link } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";

import SortButton from "./SortButton";
import { AddDef } from "./types";
import { getColumnHeader } from "./utils";

type WrapperProps = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

const Wrapper = ({ children, ...rest }: WrapperProps) => (
  <div role="region" {...rest}>
    <div className="overflow-x-auto overflow-y-hidden rounded-md shadow-md">
      {children}
    </div>
  </div>
);

type TableProps = DetailedHTMLProps<
  TableHTMLAttributes<HTMLTableElement>,
  HTMLTableElement
>;

const Table = ({ children, ...rest }: TableProps) => (
  <table
    role="table"
    className="block w-full border-collapse bg-white sm:table dark:bg-gray-600"
    {...rest}
  >
    {children}
  </table>
);

type CaptionProps = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;

const Caption = (props: CaptionProps) => (
  <caption className="sr-only" {...props} />
);

type HeadProps = DetailedHTMLProps<
  HTMLAttributes<HTMLTableSectionElement>,
  HTMLTableSectionElement
>;

const Head = (props: HeadProps) => <thead {...props} />;

type BodyProps = DetailedHTMLProps<
  HTMLAttributes<HTMLTableSectionElement>,
  HTMLTableSectionElement
>;

const Body = (props: BodyProps) => (
  // Note: Need to specify role for mobile responsive styles
  // eslint-disable-next-line jsx-a11y/no-redundant-roles
  <tbody
    role="rowgroup"
    className="block w-full sm:table-row-group"
    {...props}
  />
);

const baseRow = tv({
  base: "px-6 py-4.5 *:py-1.5 sm:py-0 sm:*:p-3 sm:*:first:pl-6 sm:*:last:pr-6",
});

const baseCell = tv({
  base: "text-left",
});

type RowProps = DetailedHTMLProps<
  HTMLAttributes<HTMLTableRowElement>,
  HTMLTableRowElement
>;

const hr = tv({
  extend: baseRow,
  base: "hidden sm:table-row",
});

const HeadRow = (props: RowProps) => <tr className={hr()} {...props} />;

const tr = tv({
  extend: baseRow,
  base: "flex flex-row flex-wrap items-center justify-between border-gray-500 not-last:border-b odd:bg-white even:bg-gray-100/50 sm:table-row dark:border-gray-300 dark:odd:bg-gray-600 dark:even:bg-gray-700/50",
});

const Row = (props: RowProps) => <tr role="row" className={tr()} {...props} />;

type AriaSort = "ascending" | "descending" | "none" | undefined;

type CellHTMLProps = DetailedHTMLProps<
  HTMLAttributes<HTMLTableCellElement>,
  HTMLTableCellElement
>;

const headCell = tv({
  extend: baseCell,
  base: "hidden bg-black/80 align-middle text-sm/normal font-normal text-white sm:table-cell",
  variants: {
    preventShrink: {
      true: "min-w-48",
    },
  },
});

type HeadCellProps<T> = {
  header: Header<T, unknown>;
  id: string;
} & CellHTMLProps;

const HeadCell = <T,>({ header, id, ...rest }: HeadCellProps<T>) => {
  const isRowSelect = header.column.columnDef.meta?.isRowSelect;
  const shouldShrink = header.column.columnDef.meta?.shrink;
  const sortingLocked = header.column.columnDef.meta?.sortingLocked;
  const sortDirection = header.column.getIsSorted();
  let ariaSort: AriaSort = undefined;
  if (sortDirection) {
    ariaSort = sortDirection === "asc" ? "ascending" : "descending";
  }

  return (
    <th
      role="columnheader"
      {...(header.column.getCanSort() && {
        "aria-sort": ariaSort,
      })}
      className={headCell({ preventShrink: !isRowSelect && !shouldShrink })}
      {...rest}
    >
      {header.isPlaceholder ? null : (
        <SortButton tableId={id} column={header.column} locked={sortingLocked}>
          {flexRender(header.column.columnDef.header, header.getContext())}
        </SortButton>
      )}
    </th>
  );
};

const cellStyles = tv({
  slots: {
    base: "max-w-full text-left align-middle text-black sm:w-auto dark:text-white",
    val: "inline",
  },
  variants: {
    isRowTitle: {
      true: {
        base: "order-1 grow",
        val: "text-lg font-bold text-primary-600 sm:font-normal sm:text-inherit lg:text-xl dark:text-primary-200 sm:dark:text-inherit",
      },
    },
    shouldShrink: {
      true: { base: "w-auto shrink-0 sm:w-auto" },
      false: { base: "w-full" },
    },
    isRowSelect: {
      true: {
        base: "order-2 w-auto shrink-0",
      },
    },
  },
  compoundVariants: [
    {
      isRowTitle: false,
      isRowSelect: false,
      class: {
        base: "order-3 block sm:table-cell",
      },
    },
    {
      isRowTitle: true,
      shouldShrink: false,
      class: { base: "w-auto" },
    },
  ],
});

type CellProps<T> = {
  cell: Cell<T, unknown>;
} & CellHTMLProps;

const Cell = <T,>({ cell, ...rest }: CellProps<T>) => {
  const intl = useIntl();
  const isRowTitle = cell.column.columnDef.meta?.isRowTitle;
  const isRowSelect = cell.column.columnDef.meta?.isRowSelect;
  const shouldShrink = cell.column.columnDef.meta?.shrink;
  const header = getColumnHeader(cell.column, "mobileHeader");

  // We don't want to show the "header" for row titles or selection cells
  const showHeader =
    header &&
    !isRowSelect &&
    !isRowTitle &&
    !cell.column.columnDef.meta?.hideMobileHeader;

  const { base, val } = cellStyles({ isRowTitle, isRowSelect, shouldShrink });

  return (
    <td
      // Seems like a false positive, cell is the implicit role for this element
      // REF: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/td#technical_summary:~:text=%3Ctr%3E%20element.-,Implicit%20ARIA%20role,-cell%20if%20a
      // eslint-disable-next-line jsx-a11y/no-interactive-element-to-noninteractive-role
      role="cell"
      className={base()}
      {...rest}
    >
      {showHeader && (
        <span className="inline font-bold sm:hidden">
          {header}
          {/* eslint-disable-next-line formatjs/no-literal-string-in-jsx */}
          {intl.formatMessage(commonMessages.dividingColon)}{" "}
        </span>
      )}
      <span className={val()}>
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </span>
    </td>
  );
};

const ctrl = tv({
  base: "order-0 w-full sm:w-auto",
});

type ControlProps = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

const Control = ({ className, ...rest }: ControlProps) => (
  <div className={ctrl({ class: className })} {...rest} />
);

interface AddActionProps {
  add: AddDef;
}

const AddAction = ({ add }: AddActionProps) =>
  add.linkProps || add.component ? (
    <Control className="order-1 ml-auto shrink">
      {add.linkProps && (
        <Link
          icon={PlusCircleIcon}
          color="primary"
          mode="solid"
          href={add.linkProps.href}
          block
          state={{ from: add.linkProps.from ?? null }}
        >
          {add.linkProps.label}
        </Link>
      )}
      {add.component ?? null}
    </Control>
  ) : null;

interface ControlsProps {
  children: ReactNode;
  add?: AddDef;
}

const Controls = ({ children, add }: ControlsProps) => (
  <div className="mb-6 flex flex-wrap items-end justify-start gap-1.5 text-sm sm:mb-1.5">
    {add && <AddAction add={add} />}
    {children}
  </div>
);

export default {
  Wrapper,
  Table,
  Caption,
  Head,
  HeadRow,
  HeadCell,
  Body,
  Row,
  Cell,
  Controls,
  Control,
};
