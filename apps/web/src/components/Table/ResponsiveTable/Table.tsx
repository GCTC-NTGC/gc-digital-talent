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
import styles, { getCellStyles } from "./styles";
import { AddDef } from "./types";
import { getColumnHeader } from "./utils";

type WrapperProps = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

const Wrapper = ({ children, ...rest }: WrapperProps) => (
  <div role="region" {...rest}>
    <div className="overflow-x-auto overflow-y-hidden rounded-md shadow">
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

type RowProps = DetailedHTMLProps<
  HTMLAttributes<HTMLTableRowElement>,
  HTMLTableRowElement
>;

const HeadRow = (props: RowProps) => (
  <tr className="hidden sm:table-row" {...styles.row} {...props} />
);

const Row = (props: RowProps) => (
  <tr
    role="row"
    data-h2-display="base(flex) l-tablet(table-row)"
    data-h2-background-color="base:selectors[:nth-child(even)](background.dark.50) base:dark:selectors[:nth-child(even)](white.3) base:selectors[:nth-child(odd)](foreground)"
    data-h2-border-bottom="base:selectors[:not(:last-child)](1px solid gray.dark)"
    data-h2-flex-direction="base(row)"
    data-h2-flex-wrap="base(wrap)"
    data-h2-justify-content="base(space-between)"
    data-h2-align-items="base(center)"
    {...styles.row}
    {...props}
  />
);

type AriaSort = "ascending" | "descending" | "none" | undefined;

type CellHTMLProps = DetailedHTMLProps<
  HTMLAttributes<HTMLTableCellElement>,
  HTMLTableCellElement
>;

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
      data-h2-background-color="base(background.darkest) base:dark(white)"
      data-h2-color="base:all(white)"
      data-h2-display="base(none) l-tablet(table-cell)"
      data-h2-font-size="base(caption)"
      data-h2-vertical-align="base(middle)"
      data-h2-font-weight="base(400)"
      {...(header.column.getCanSort() && {
        "aria-sort": ariaSort,
      })}
      {...(!isRowSelect &&
        !shouldShrink && {
          "data-h2-min-width": "base(x8)",
        })}
      {...styles.cell}
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
      data-h2-vertical-align="base(middle)"
      data-h2-max-width="base(100%) l-tablet(none)"
      data-h2-color="base(black)"
      {...cellStyles.td}
      {...styles.cell}
      {...rest}
    >
      {showHeader && (
        <span
          data-h2-display="base(inline) l-tablet(none)"
          data-h2-font-weight="base(700)"
        >
          {header}
          {/* eslint-disable-next-line formatjs/no-literal-string-in-jsx */}
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
  <div
    data-h2-width="base(100%) l-tablet(auto)"
    data-h2-order="base(0)"
    {...props}
  />
);

interface AddActionProps {
  add: AddDef;
}

const AddAction = ({ add }: AddActionProps) =>
  add.linkProps || add.component ? (
    <Control
      data-h2-flex-shrink="base(1)"
      data-h2-order="base(1)"
      data-h2-margin-left="base(auto)"
    >
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
  <div
    data-h2-display="base(flex)"
    data-h2-align-items="base(flex-end)"
    data-h2-gap="base(x.25)"
    data-h2-margin-bottom="base(x1) l-tablet(x.25)"
    data-h2-justify-content="base(flex-start)"
    data-h2-font-size="base(caption)"
    data-h2-flex-wrap="base(wrap)"
  >
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
