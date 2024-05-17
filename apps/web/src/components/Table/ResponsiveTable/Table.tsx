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

import { Link, cn } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";

import SortButton from "./SortButton";
import styles, { getCellStyles } from "./styles";
import { AddDef } from "./types";
import { getColumnHeader } from "./utils";

type WrapperProps = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

const Wrapper = ({ children, ...rest }: WrapperProps) => (
  <div role="region" {...rest}>
    <div
      data-h2-overflow-x="base(auto)"
      data-h2-overflow-y="base(hidden)"
      data-h2-radius="base(s)"
      data-h2-shadow="base(medium)"
    >
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
    data-h2-background-color="base(foreground)"
    data-h2-border-collapse="base(collapse)"
    data-h2-display="base(block) l-tablet(table)"
    data-h2-width="base(100%)"
    {...rest}
  >
    {children}
  </table>
);

type CaptionProps = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;

const Caption = (props: CaptionProps) => (
  <caption data-h2-visually-hidden="base(invisible)" {...props} />
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
    data-h2-width="base(100%)"
    data-h2-display="base(block) l-tablet(table-row-group)"
    {...props}
  />
);

type RowProps = DetailedHTMLProps<
  HTMLAttributes<HTMLTableRowElement>,
  HTMLTableRowElement
>;

const HeadRow = (props: RowProps) => (
  <tr className={cn("hidden md:table-row", styles.row)} {...props} />
);

const Row = (props: RowProps) => (
  <tr
    role="row"
    className={cn(
      "flex flex-row flex-wrap items-center justify-between md:table-row",
      styles.row,
    )}
    data-h2-background-color="base:selectors[:nth-child(even)](background.dark.50) base:dark:selectors[:nth-child(even)](white.3) base:selectors[:nth-child(odd)](foreground)"
    data-h2-border-bottom="base:selectors[:not(:last-child)](1px solid gray.dark)"
    {...props}
  />
);

type CellHTMLProps = DetailedHTMLProps<
  HTMLAttributes<HTMLTableCellElement>,
  HTMLTableCellElement
>;

type HeadCellProps<T> = {
  header: Header<T, unknown>;
} & CellHTMLProps;

const HeadCell = <T,>({ header, ...rest }: HeadCellProps<T>) => {
  const isRowSelect = header.column.columnDef.meta?.isRowSelect;
  const shouldShrink = header.column.columnDef.meta?.shrink;
  const sortingLocked = header.column.columnDef.meta?.sortingLocked;
  return (
    <th
      role="columnheader"
      data-h2-background-color="base(background.darkest) base:dark(white)"
      data-h2-color="base:all(white)"
      className={cn(
        "none align-middle font-normal md:table-cell",
        {
          "min-w-56": !isRowSelect && !shouldShrink,
        },
        styles.cell,
      )}
      {...rest}
    >
      {header.isPlaceholder ? null : (
        <SortButton column={header.column} locked={sortingLocked}>
          {flexRender(header.column.columnDef.header, header.getContext())}
        </SortButton>
      )}
    </th>
  );
};

type CellProps<T> = {
  cell: Cell<T, unknown>;
} & CellHTMLProps;

const Cell = <T,>({ cell, ...rest }: CellProps<T>) => {
  const intl = useIntl();
  const isRowTitle = cell.column.columnDef.meta?.isRowTitle;
  const isRowSelect = cell.column.columnDef.meta?.isRowSelect;
  const shouldShrink = cell.column.columnDef.meta?.shrink;
  const cellStyles = getCellStyles({
    isRowTitle,
    isRowSelect,
    shouldShrink,
  });
  const header = getColumnHeader(cell.column, "mobileHeader");

  // We don't want to show the "header" for row titles or selection cells
  const showHeader =
    header &&
    !isRowSelect &&
    !isRowTitle &&
    !cell.column.columnDef.meta?.hideMobileHeader;

  return (
    <td
      // Seems like a false positive, cell is the implicit role for this element
      // REF: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/td#technical_summary:~:text=%3Ctr%3E%20element.-,Implicit%20ARIA%20role,-cell%20if%20a
      // eslint-disable-next-line jsx-a11y/no-interactive-element-to-noninteractive-role
      role="cell"
      className={cn(
        "max-w-full align-middle md:max-w-none",
        styles.cell,
        cellStyles.td,
      )}
      data-h2-color="base(black)"
      {...rest}
    >
      {showHeader && (
        <span className="inline font-bold md:hidden">
          {header}
          {intl.formatMessage(commonMessages.dividingColon)}{" "}
        </span>
      )}
      <span {...cellStyles.value}>
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </span>
    </td>
  );
};

type ControlProps = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

const Control = (props: ControlProps) => (
  <div className="w-full md:w-auto" {...props} />
);

interface AddActionProps {
  add: AddDef;
}

const AddAction = ({ add }: AddActionProps) => (
  <>
    {add.linkProps && (
      <Control className="shrink-0">
        <Link
          icon={PlusCircleIcon}
          color="secondary"
          mode="solid"
          href={add.linkProps.href}
          block
          state={{ from: add.linkProps.from ?? null }}
        >
          {add.linkProps.label}
        </Link>
      </Control>
    )}
    {add.component && <Control>{add.component}</Control>}
  </>
);

interface ControlsProps {
  children: ReactNode;
  add?: AddDef;
}

const Controls = ({ children, add }: ControlsProps) => (
  <div
    className="mb-6 flex flex-col items-end justify-between gap-x-1.5 gap-y-1.5 md:mb-1.5 md:flex-row md:gap-y-0"
    data-h2-font-size="base(caption)"
  >
    {add && <AddAction add={add} />}
    <div className="-order-1 flex w-full flex-grow flex-col items-end gap-y-1.5 md:w-auto md:flex-row md:gap-x-1.5 md:gap-y-0">
      {children}
    </div>
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
